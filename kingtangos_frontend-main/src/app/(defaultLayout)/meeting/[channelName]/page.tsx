/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

// "use client";
// import PageLoading from "@/components/ui/Loading";
// import { useGenerateAgoraTokenMutation } from "../(apis)/api";
// import { useGetUserQuery } from "@/lib/api/users/userApi";
// import AgoraRTC, {
//   IAgoraRTCClient,
//   IAgoraRTCRemoteUser,
//   ILocalAudioTrack,
//   ILocalVideoTrack,
//   IRemoteAudioTrack,
//   IRemoteVideoTrack,
// } from "agora-rtc-sdk-ng";
// import {
//   AlertTriangle,
//   Check,
//   Clock,
//   Copy,
//   Loader2,
//   Maximize2,
//   Mic,
//   MicOff,
//   Minimize2,
//   MonitorUp,
//   PhoneOff,
//   Share2,
//   Users,
//   Video,
//   VideoOff,
// } from "lucide-react";
// import MeetingTimer from "../(components)/MeetingTimer";
// import { useParams, useRouter, useSearchParams } from "next/navigation";
// import React, {
//   MouseEvent,
//   useCallback,
//   useEffect,
//   useRef,
//   useState,
// } from "react";

// // Add some basic CSS for animations directly
// const meetingStyles = `
//   @keyframes shake {
//     0%, 100% { transform: translateX(0); }
//     25% { transform: translateX(-4px); }
//     75% { transform: translateX(4px); }
//   }
//   .animate-shake { animation: shake 0.4s ease-in-out; }
//   .animate-fade-in { animation: fadeIn 0.5s ease-out; }
//   @keyframes fadeIn {
//     from { opacity: 0; transform: translateY(10px); }
//     to { opacity: 1; transform: translateY(0); }
//   }
//   body { overflow: hidden !important; }
// `;

// type RemoteUserState = {
//   user: IAgoraRTCRemoteUser;
//   hasVideo: boolean;
//   hasAudio: boolean;
//   uid: number;
//   isScreen?: boolean;
// };

// const RETRY_SUBSCRIBE_MS = 700;
// const MAX_SUBSCRIBE_RETRIES = 4;

// export default function MeetingRoom() {
//   const params = useParams();
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const channelName = (params?.channelName || "") as string;
//   const startTime = searchParams?.get("start");

//   return (
//     <>
//       <style dangerouslySetInnerHTML={{ __html: meetingStyles }} />
//       <MeetingContent
//         channelName={channelName}
//         startTime={startTime}
//         router={router}
//       />
//     </>
//   );
// }

// function MeetingContent({
//   channelName,
//   startTime,
//   router,
// }: {
//   channelName: string;
//   startTime: string | null;
//   router: any;
// }) {
//   const [generateToken, { isLoading: isGenerating }] =
//     useGenerateAgoraTokenMutation();

//   const { data, isLoading, isError } = useGetUserQuery();
//   const usersId = data?.data?.id;

//   // Agora refs
//   const clientRef = useRef<IAgoraRTCClient | null>(null);
//   const localVideoTrackRef = useRef<ILocalVideoTrack | null>(null);
//   const localAudioTrackRef = useRef<ILocalAudioTrack | null>(null);
//   const screenTrackRef = useRef<ILocalVideoTrack | null>(null);
//   const hasInitialized = useRef(false);
//   const isLeavingRef = useRef(false);

//   // DOM refs
//   const prejoinLocalRef = useRef<HTMLDivElement | null>(null);
//   const floatingPreviewRef = useRef<HTMLDivElement | null>(null);
//   const remoteVideoRefs = useRef<Map<number, HTMLDivElement>>(new Map());
//   const fullScreenVideoRef = useRef<HTMLDivElement | null>(null);

//   // UI state
//   const [isJoined, setIsJoined] = useState(false);
//   const [isJoining, setIsJoining] = useState(false);
//   const [isMicOn, setIsMicOn] = useState(true);
//   const [isVideoOn, setIsVideoOn] = useState(true);
//   const [isScreenSharing, setIsScreenSharing] = useState(false);
//   const [remoteUsers, setRemoteUsers] = useState<Map<number, RemoteUserState>>(
//     new Map(),
//   );
//   const [error, setError] = useState<string | null>(null);
//   const [copied, setCopied] = useState(false);
//   const [showShareModal, setShowShareModal] = useState(false);
//   const [fullScreenUser, setFullScreenUser] = useState<number | null>(null);
//   const [waitingTime, setWaitingTime] = useState<number>(0);
//   const [isBeforeStart, setIsBeforeStart] = useState<boolean>(false);
//   const [showControls, setShowControls] = useState(true);

//   // inactivity timeout
//   const activityTimeoutRef = useRef<NodeJS.Timeout | null>(null);

//   const handleActivity = useCallback(() => {
//     setShowControls(true);
//     if (activityTimeoutRef.current) clearTimeout(activityTimeoutRef.current);
//     activityTimeoutRef.current = setTimeout(() => {
//       // Only hide if modal is not open
//       setShowControls(false);
//     }, 3000);
//   }, []);

//   // Update activity based on mouse/touch
//   useEffect(() => {
//     if (isJoined && !showShareModal) {
//       window.addEventListener("mousemove", handleActivity);
//       window.addEventListener("mousedown", handleActivity);
//       window.addEventListener("touchstart", handleActivity);
//       window.addEventListener("scroll", handleActivity);

//       handleActivity();

//       return () => {
//         window.removeEventListener("mousemove", handleActivity);
//         window.removeEventListener("mousedown", handleActivity);
//         window.removeEventListener("touchstart", handleActivity);
//         window.removeEventListener("scroll", handleActivity);
//         if (activityTimeoutRef.current)
//           clearTimeout(activityTimeoutRef.current);
//       };
//     } else {
//       setShowControls(true);
//       if (activityTimeoutRef.current) clearTimeout(activityTimeoutRef.current);
//     }
//   }, [isJoined, showShareModal, handleActivity]);

//   // floating preview drag
//   const floatRef = useRef<HTMLDivElement | null>(null);
//   const floatPos = useRef({ x: 16, y: window.innerHeight - 160 }); // Initial approx position used until mounted effect adjustments
//   const dragStateRef = useRef<{
//     dragging: boolean;
//     startX: number;
//     startY: number;
//   } | null>(null);

//   // meeting link
//   const meetingLink =
//     typeof window !== "undefined"
//       ? `${window.location.origin}/meeting/${channelName}${startTime ? `?start=${startTime}` : ""}`
//       : "";

//   // --- Pre-meeting logic ---
//   useEffect(() => {
//     if (!startTime) return;

//     const targetDate = new Date(startTime).getTime();

//     const checkTime = () => {
//       const now = Date.now();
//       const diff = Math.floor((targetDate - now) / 1000);

//       if (diff > 0) {
//         setIsBeforeStart(true);
//         setWaitingTime(diff);
//       } else {
//         setIsBeforeStart(false);
//         setWaitingTime(0);
//       }
//     };

//     checkTime();
//     const interval = setInterval(checkTime, 1000);
//     return () => clearInterval(interval);
//   }, [startTime]);

//   const formatCountdown = (seconds: number) => {
//     const hrs = Math.floor(seconds / 3600);
//     const mins = Math.floor((seconds % 3600) / 60);
//     const secs = seconds % 60;
//     return [
//       hrs > 0 ? String(hrs).padStart(2, "0") : null,
//       String(mins).padStart(2, "0"),
//       String(secs).padStart(2, "0"),
//     ]
//       .filter(Boolean)
//       .join(":");
//   };

//   // --- Helper functions ---
//   const log = useCallback((...args: unknown[]) => {
//     console.log("[AgoraMeeting]", ...args);
//   }, []);

//   const clearError = useCallback(() => {
//     setError(null);
//   }, []);

//   // --- Cleanup functions ---
//   const cleanupLocalTracks = useCallback(async () => {
//     try {
//       if (screenTrackRef.current) {
//         screenTrackRef.current.close();
//         screenTrackRef.current = null;
//       }
//       if (localAudioTrackRef.current) {
//         localAudioTrackRef.current.close();
//         localAudioTrackRef.current = null;
//       }
//       if (localVideoTrackRef.current) {
//         localVideoTrackRef.current.close();
//         localVideoTrackRef.current = null;
//       }
//     } catch (err) {
//       console.error("Error cleaning up local tracks:", err);
//     }
//   }, []);

//   const cleanupClient = useCallback(async () => {
//     const client = clientRef.current;
//     if (!client) return;

//     try {
//       if (client.connectionState !== "DISCONNECTED") {
//         await client.leave();
//         log("Left channel");
//       }
//     } catch (err) {
//       console.error("Error leaving client:", err);
//     }
//   }, [log]);

//   // --- Track management ---
//   const stopScreenShare = useCallback(async () => {
//     const client = clientRef.current;
//     const screenTrack = screenTrackRef.current;

//     if (!client) return;

//     try {
//       // Unpublish screen track if exists
//       if (screenTrack) {
//         await client.unpublish([screenTrack]);
//         screenTrack.close();
//         screenTrackRef.current = null;
//         log("Stopped and unpublished screen track");
//       }

//       // Publish camera track again if we have one
//       if (localVideoTrackRef.current) {
//         try {
//           // Agora doesn't allow publishing disabled tracks
//           await localVideoTrackRef.current.setEnabled(true);
//           await client.publish([localVideoTrackRef.current]);
//           // Restore state
//           await localVideoTrackRef.current.setEnabled(isVideoOn);
//           log("Re-published camera track after stopping screen");
//         } catch (publishErr) {
//           console.error("Error publishing camera track:", publishErr);
//         }

//         // Update floating preview to show camera
//         if (floatingPreviewRef.current) {
//           try {
//             if (localVideoTrackRef.current.isPlaying) {
//               localVideoTrackRef.current.stop();
//             }
//             localVideoTrackRef.current.play(floatingPreviewRef.current, {
//               fit: "cover",
//             });
//             log("Updated floating preview to show camera");
//           } catch (playErr) {
//             console.warn("Could not play camera in floating preview:", playErr);
//           }
//         }
//       }

//       setIsScreenSharing(false);
//     } catch (err) {
//       console.error("Error stopping screen share:", err);
//       setError("Error stopping screen share. Please try again.");
//       setTimeout(clearError, 3000);
//     }
//   }, [log, clearError]);

//   // --- Helper to attempt subscribe with retries ---
//   const retrySubscribe = useCallback(
//     async (
//       client: IAgoraRTCClient,
//       user: IAgoraRTCRemoteUser,
//       mediaType: "video" | "audio",
//       attempt: number,
//     ) => {
//       try {
//         log(
//           `Attempt subscribe ${attempt} -> user:${user.uid} media:${mediaType}`,
//         );
//         await client.subscribe(user, mediaType);
//         log("Subscribed to remote user:", user.uid, mediaType);

//         const uidNum = Number(user.uid);

//         if (mediaType === "video") {
//           const remoteVideo = user.videoTrack as IRemoteVideoTrack | undefined;

//           // Check if it's screen share
//           let isScreen = false;
//           if (remoteVideo) {
//             const track = remoteVideo as unknown as {
//               track?: { label?: string };
//               isScreen?: boolean;
//             };
//             const label = track.track?.label?.toLowerCase?.() || "";
//             isScreen = label.includes("screen") || track.isScreen || false;
//           }

//           setRemoteUsers((prev) => {
//             const copy = new Map(prev);
//             const existing = copy.get(uidNum);
//             if (existing) {
//               copy.set(uidNum, {
//                 ...existing,
//                 user,
//                 hasVideo: true,
//                 isScreen: isScreen || existing.isScreen,
//               });
//             } else {
//               copy.set(uidNum, {
//                 user,
//                 hasVideo: true,
//                 hasAudio: !!user.audioTrack,
//                 uid: uidNum,
//                 isScreen,
//               });
//             }
//             return copy;
//           });

//           // Play remote video into registered DOM node if available
//           const videoRef = remoteVideoRefs.current.get(uidNum);
//           if (remoteVideo && videoRef) {
//             try {
//               remoteVideo.play(videoRef, {
//                 fit: "cover",
//               });
//             } catch (err) {
//               console.warn("Could not play remote video immediately", err);
//             }
//           }
//         } else if (mediaType === "audio") {
//           const remoteAudio = user.audioTrack as IRemoteAudioTrack | undefined;
//           if (remoteAudio) {
//             remoteAudio.play();
//           }

//           setRemoteUsers((prev) => {
//             const copy = new Map(prev);
//             const existing = copy.get(uidNum);
//             if (existing) {
//               copy.set(uidNum, {
//                 ...existing,
//                 hasAudio: true,
//                 user,
//               });
//             } else {
//               copy.set(uidNum, {
//                 user,
//                 hasVideo: !!user.videoTrack,
//                 hasAudio: true,
//                 uid: uidNum,
//                 isScreen: false,
//               });
//             }
//             return copy;
//           });
//         }
//       } catch (err) {
//         console.warn(
//           "Subscribe failed for user",
//           user.uid,
//           "media",
//           mediaType,
//           "attempt",
//           attempt,
//           err,
//         );
//         if (attempt < MAX_SUBSCRIBE_RETRIES) {
//           setTimeout(
//             () => retrySubscribe(client, user, mediaType, attempt + 1),
//             RETRY_SUBSCRIBE_MS * (attempt + 1),
//           );
//         } else {
//           console.error(
//             "Max subscribe retries reached for",
//             user.uid,
//             mediaType,
//           );
//         }
//       }
//     },
//     [log],
//   );

//   // --- Event handlers ---
//   const handleUserJoined = useCallback(
//     (user: IAgoraRTCRemoteUser) => {
//       log("user-joined:", user.uid);
//       const uidNum = Number(user.uid);
//       setRemoteUsers((prev) => {
//         const copy = new Map(prev);
//         const existing = copy.get(uidNum);

//         if (existing) {
//           copy.set(uidNum, {
//             ...existing,
//             user,
//             hasVideo: !!user.videoTrack || existing.hasVideo,
//             hasAudio: !!user.audioTrack || existing.hasAudio,
//           });
//         } else {
//           copy.set(uidNum, {
//             user,
//             hasVideo: !!user.videoTrack,
//             hasAudio: !!user.audioTrack,
//             uid: uidNum,
//             isScreen: false,
//           });
//         }
//         return copy;
//       });
//     },
//     [log],
//   );

//   const handleUserPublished = useCallback(
//     async (user: IAgoraRTCRemoteUser, mediaType: string) => {
//       log("user-published event:", user.uid, mediaType);
//       const client = clientRef.current;
//       if (client) {
//         await retrySubscribe(client, user, mediaType as "video" | "audio", 0);
//       }
//     },
//     [retrySubscribe, log],
//   );

//   const handleUserUnpublished = useCallback(
//     (user: IAgoraRTCRemoteUser, mediaType: string) => {
//       log("user-unpublished:", user.uid, mediaType);
//       const uidNum = Number(user.uid);
//       setRemoteUsers((prev) => {
//         const copy = new Map(prev);
//         const existing = copy.get(uidNum);
//         if (!existing) return prev;

//         copy.set(uidNum, {
//           ...existing,
//           hasVideo: mediaType === "video" ? false : existing.hasVideo,
//           hasAudio: mediaType === "audio" ? false : existing.hasAudio,
//         });
//         return copy;
//       });
//     },
//     [log],
//   );

//   const handleUserLeft = useCallback(
//     (user: IAgoraRTCRemoteUser) => {
//       log("user-left:", user.uid);
//       const uidNum = Number(user.uid);
//       setRemoteUsers((prev) => {
//         const copy = new Map(prev);
//         copy.delete(uidNum);
//         return copy;
//       });
//       setFullScreenUser((prev) => (prev === uidNum ? null : prev));
//     },
//     [log],
//   );

//   // --- Create pre-join preview tracks ---
//   useEffect(() => {
//     let mounted = true;

//     const createPrejoinTracks = async () => {
//       if (!mounted) return;

//       try {
//         log("Creating prejoin preview tracks");

//         // Create video track first (camera) - Optional
//         if (!localVideoTrackRef.current) {
//           try {
//             const cameraTrack = await AgoraRTC.createCameraVideoTrack({
//               encoderConfig: { width: 640, height: 480, frameRate: 30 },
//             });

//             if (!mounted) {
//               cameraTrack.close();
//               return;
//             }

//             localVideoTrackRef.current = cameraTrack;
//             await cameraTrack.setEnabled(true);

//             // Wait for DOM element to be available
//             const waitForElement = () => {
//               if (prejoinLocalRef.current && mounted) {
//                 try {
//                   cameraTrack.play(prejoinLocalRef.current, {
//                     fit: "cover",
//                   });
//                   log("Local camera preview playing in prejoin element");
//                 } catch (playErr) {
//                   console.warn("Could not play in prejoin element:", playErr);
//                   if (mounted) setTimeout(waitForElement, 100);
//                 }
//               } else if (mounted) {
//                 setTimeout(waitForElement, 100);
//               }
//             };
//             waitForElement();
//             log("Local camera preview ready");
//           } catch (cameraErr) {
//             console.warn(
//               "Camera hardware missing or permission denied:",
//               cameraErr,
//             );
//             // Non-blocking warning
//           }
//         }

//         // Create audio track - Optional
//         if (!localAudioTrackRef.current) {
//           try {
//             const micTrack = await AgoraRTC.createMicrophoneAudioTrack();
//             if (!mounted) {
//               micTrack.close();
//               return;
//             }
//             localAudioTrackRef.current = micTrack;
//             await micTrack.setEnabled(false); // Start muted
//             log("Local microphone preview ready");
//           } catch (micErr) {
//             console.warn(
//               "Microphone hardware missing or permission denied:",
//               micErr,
//             );
//           }
//         }
//       } catch (err: unknown) {
//         console.error("Critical prejoin track error:", err);
//       }
//     };

//     createPrejoinTracks();

//     return () => {
//       mounted = false;
//     };
//   }, [log]);

//   // Re-attach video to prejoin element when ref changes
//   useEffect(() => {
//     if (prejoinLocalRef.current && localVideoTrackRef.current && !isJoined) {
//       try {
//         if (localVideoTrackRef.current.isPlaying) {
//           localVideoTrackRef.current.stop();
//         }
//         localVideoTrackRef.current.play(prejoinLocalRef.current, {
//           fit: "cover",
//         });
//       } catch (err) {
//         console.warn("Error re-attaching prejoin video:", err);
//       }
//     }
//   }, [isJoined]);

//   // --- Initialize Agora client (only once) ---
//   useEffect(() => {
//     if (!channelName || hasInitialized.current) return;
//     hasInitialized.current = true;

//     const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
//     clientRef.current = client;

//     log("Client created for channel:", channelName);

//     // Dynamic listeners using refs/callback stable versions
//     client.on("connection-state-change", (cur, rev) => {
//       log("Connection state change:", cur, rev);
//     });

//     client.on("user-joined", (u) => handleUserJoined(u));
//     client.on("user-published", (u, m) => handleUserPublished(u, m));
//     client.on("user-unpublished", (u, m) => handleUserUnpublished(u, m));
//     client.on("user-left", (u) => handleUserLeft(u));

//     client.on("exception", (evt) => {
//       log("client exception:", evt);
//     });
//   }, [
//     channelName,
//     log,
//     handleUserJoined,
//     handleUserPublished,
//     handleUserUnpublished,
//     handleUserLeft,
//   ]);

//   // Dedicated cleanup effect for UNMOUNT ONLY
//   useEffect(() => {
//     return () => {
//       if (isLeavingRef.current) return;
//       const cleanup = async () => {
//         try {
//           log("Cleaning up client on unmount");
//           await cleanupLocalTracks();
//           await cleanupClient();
//         } catch (err) {
//           console.error("Cleanup error:", err);
//         }
//       };
//       cleanup();
//     };
//   }, [cleanupLocalTracks, cleanupClient, log]);

//   // Consolidated Video Playback Controller
//   useEffect(() => {
//     const playTrack = async (
//       track: IRemoteVideoTrack,
//       element: HTMLDivElement,
//       fit: "cover" | "contain",
//       uid: number,
//     ) => {
//       try {
//         // Agora's .play() is async and can throw AbortError if interrupted
//         await track.play(element, { fit });
//         log("Playing video for", uid, "fit:", fit);
//       } catch (err: any) {
//         // Silently handle AbortError as it's just a playback interruption
//         if (err.name !== "AbortError") {
//           console.warn("Playback error for user", uid, err);
//         }
//       }
//     };

//     remoteUsers.forEach((state) => {
//       if (!state.hasVideo || !state.user.videoTrack) return;

//       const remoteVideo = state.user.videoTrack as IRemoteVideoTrack;
//       const isSpotlighted = fullScreenUser === state.uid;

//       // Determine the correct target element and fit mode
//       const targetElement = isSpotlighted
//         ? fullScreenVideoRef.current
//         : remoteVideoRefs.current.get(state.uid);

//       if (targetElement) {
//         const fitMode = isSpotlighted || state.isScreen ? "contain" : "cover";
//         playTrack(remoteVideo, targetElement, fitMode, state.uid);
//       }
//     });
//   }, [remoteUsers, fullScreenUser, log]);

//   // Update floating preview when video track changes (or when exiting spotlight)
//   useEffect(() => {
//     if (isJoined && floatingPreviewRef.current && fullScreenUser === null) {
//       const currentTrack = isScreenSharing
//         ? screenTrackRef.current
//         : localVideoTrackRef.current;

//       if (currentTrack && floatingPreviewRef.current) {
//         try {
//           if (currentTrack.isPlaying) {
//             currentTrack.stop();
//           }
//           currentTrack.play(floatingPreviewRef.current, {
//             fit: isScreenSharing ? "contain" : "cover",
//           });
//           log("Restored local video in floating preview");
//         } catch (err) {
//           console.error("Error updating local preview:", err);
//         }
//       }
//     }
//   }, [isJoined, isScreenSharing, fullScreenUser, log]);

//   // --- Action functions ---
//   const joinMeeting = async () => {
//     setIsJoining(true);
//     setError(null);
//     const client = clientRef.current;
//     if (!client) {
//       setError("RTC client not ready");
//       setIsJoining(false);
//       return;
//     }

//     try {
//       const userId = usersId || Math.random().toString(36).substring(2, 15);
//       const role = "publisher";
//       log("Requesting token for channel:", channelName, "userId:", userId);

//       const response = await generateToken({
//         channelName,
//         userId,
//         role,
//       }).unwrap();

//       if (!response.success || !response.data) {
//         throw new Error(response.message || "Token generation failed");
//       }

//       const cfg = {
//         appId: response.data.appId,
//         token: response.data.token,
//         channel: response.data.channelName,
//         uid: response.data.uid,
//       };

//       log("Joining channel:", cfg.channel, "uid:", cfg.uid);

//       // join
//       await client.join(cfg.appId, cfg.channel, cfg.token, cfg.uid);
//       log("Successfully joined channel:", cfg.channel);

//       // Sync existing users immediately after joining
//       setRemoteUsers(() => {
//         const map = new Map<number, RemoteUserState>();
//         client.remoteUsers.forEach((user) => {
//           const u = Number(user.uid);
//           map.set(u, {
//             user,
//             hasVideo: !!user.videoTrack,
//             hasAudio: !!user.audioTrack,
//             uid: u,
//             isScreen: false,
//           });
//         });
//         return map;
//       });

//       // Process audio track - Optional
//       if (!localAudioTrackRef.current) {
//         try {
//           const mic = await AgoraRTC.createMicrophoneAudioTrack();
//           localAudioTrackRef.current = mic;
//         } catch (micErr) {
//           console.warn("Could not create mic track on join:", micErr);
//           // Don't set isMicOn to false yet, just log it.
//           // We'll handle the absence of track during publish.
//         }
//       }

//       if (localAudioTrackRef.current) {
//         try {
//           // Agora doesn't allow publishing disabled tracks
//           await localAudioTrackRef.current.setEnabled(true);
//           await client.publish([localAudioTrackRef.current]);
//           // Restore user's intended state
//           await localAudioTrackRef.current.setEnabled(isMicOn);
//           log("Published audio track");
//         } catch (pubErr) {
//           console.error("Audio publish failed:", pubErr);
//         }
//       }

//       // Process video track - Optional
//       if (!localVideoTrackRef.current) {
//         try {
//           const cam = await AgoraRTC.createCameraVideoTrack({
//             encoderConfig: { width: 640, height: 480, frameRate: 30 },
//           });
//           localVideoTrackRef.current = cam;
//         } catch (camErr) {
//           console.warn("Could not create cam track on join:", camErr);
//         }
//       }

//       if (localVideoTrackRef.current) {
//         try {
//           // Agora doesn't allow publishing disabled tracks
//           await localVideoTrackRef.current.setEnabled(true);
//           await client.publish([localVideoTrackRef.current]);
//           // Restore user's intended state
//           await localVideoTrackRef.current.setEnabled(isVideoOn);
//           log("Published video track");

//           if (floatingPreviewRef.current) {
//             localVideoTrackRef.current.play(floatingPreviewRef.current, {
//               fit: "cover",
//             });
//           }
//         } catch (pubErr) {
//           console.error("Video publish failed:", pubErr);
//         }
//       }

//       setIsJoined(true);
//       setShowShareModal(true);
//     } catch (err: unknown) {
//       console.error("Error joining meeting:", err);
//       let msg = "Failed to join meeting. Please try again.";
//       if (err instanceof Error) {
//         const message = err.message;
//         if (message.includes("PERMISSION_DENIED")) {
//           msg = "Camera/microphone permission denied.";
//         } else if (
//           message.includes("NotFoundError") ||
//           message.includes("NOT_FOUND")
//         ) {
//           msg = "Camera or microphone not found.";
//         } else {
//           msg = message;
//         }
//       }
//       setError(msg);
//     } finally {
//       setIsJoining(false);
//     }
//   };

//   const toggleMic = async () => {
//     try {
//       const audio = localAudioTrackRef.current;
//       if (!audio) {
//         try {
//           const mic = await AgoraRTC.createMicrophoneAudioTrack();
//           localAudioTrackRef.current = mic;
//           await mic.setEnabled(true);
//           setIsMicOn(true);
//           if (isJoined && clientRef.current) {
//             await clientRef.current.publish([mic]);
//           }
//           return;
//         } catch (err) {
//           log("Could not start microphone:", err);
//           setError("Microphone not found or permission denied.");
//           setTimeout(clearError, 3000);
//           return;
//         }
//       }
//       const newState = !isMicOn;
//       await audio.setEnabled(newState);
//       setIsMicOn(newState);
//       log("Toggled mic. Now isMicOn:", newState);
//     } catch (err) {
//       console.error("Error toggling mic:", err);
//       setError("Cannot toggle microphone.");
//       setTimeout(clearError, 3000);
//     }
//   };

//   const toggleVideo = async () => {
//     try {
//       const video = localVideoTrackRef.current;
//       const newState = !isVideoOn;

//       if (!video) {
//         try {
//           const cam = await AgoraRTC.createCameraVideoTrack({
//             encoderConfig: { width: 640, height: 480, frameRate: 30 },
//           });
//           localVideoTrackRef.current = cam;
//           if (prejoinLocalRef.current) {
//             cam.play(prejoinLocalRef.current, { fit: "cover" });
//           }
//           await cam.setEnabled(true);
//           setIsVideoOn(true);
//           if (isJoined && clientRef.current) {
//             await clientRef.current.publish([cam]);
//             if (floatingPreviewRef.current) {
//               cam.play(floatingPreviewRef.current, { fit: "cover" });
//             }
//           }
//           return;
//         } catch (err) {
//           log("Could not start camera:", err);
//           setError("Camera not found or permission denied.");
//           setTimeout(clearError, 3000);
//           return;
//         }
//       }

//       await video.setEnabled(newState);
//       setIsVideoOn(newState);
//       log("Toggled video. Now isVideoOn:", newState);
//     } catch (err) {
//       console.error("Error toggling video:", err);
//       setError("Cannot toggle camera.");
//       setTimeout(clearError, 3000);
//     }
//   };

//   const toggleScreenShare = async () => {
//     const client = clientRef.current;
//     if (!client) return;

//     try {
//       if (!isScreenSharing) {
//         log("Starting screen share: creating screen track");
//         const screenTrack = await AgoraRTC.createScreenVideoTrack({
//           encoderConfig: "1080p_1",
//         });
//         screenTrackRef.current = screenTrack as ILocalVideoTrack;

//         // Unpublish camera track and publish screen track
//         if (localVideoTrackRef.current) {
//           try {
//             await client.unpublish([localVideoTrackRef.current]);
//             log("Unpublished camera track to publish screen only");
//           } catch (e) {
//             console.warn(
//               "Could not unpublish camera before publishing screen",
//               e,
//             );
//           }
//         }

//         await client.publish([screenTrack as ILocalVideoTrack]);
//         log("Published screen track to channel");

//         // Play screen share preview in floating window for the sharer
//         if (floatingPreviewRef.current && screenTrackRef.current) {
//           try {
//             screenTrackRef.current.play(floatingPreviewRef.current, {
//               fit: "contain",
//             });
//             log("Screen track playing in floating preview for presenter");
//           } catch (e) {
//             console.warn("Could not play screen in floating preview", e);
//           }
//         }

//         (screenTrack as ILocalVideoTrack).on("track-ended", async () => {
//           log("Screen share track ended (native event)");
//           await stopScreenShare();
//         });

//         setIsScreenSharing(true);
//       } else {
//         await stopScreenShare();
//       }
//     } catch (err: unknown) {
//       console.error("Screen share error:", err);
//       const errorMessage = err instanceof Error ? err.message : "Unknown error";
//       setError(
//         errorMessage.includes("PERMISSION_DENIED")
//           ? "Screen sharing permission denied. Please allow permissions."
//           : "Failed to share screen. Please allow screen-sharing permissions.",
//       );
//       setTimeout(clearError, 3000);
//     }
//   };

//   const leaveCall = async () => {
//     isLeavingRef.current = true;
//     try {
//       if (isScreenSharing) {
//         await stopScreenShare();
//       }
//       await cleanupLocalTracks();
//       await cleanupClient();
//     } catch (err) {
//       console.error("Error leaving call:", err);
//     } finally {
//       router.push("/meeting");
//     }
//   };

//   const copyLink = async () => {
//     try {
//       await navigator.clipboard.writeText(meetingLink);
//       setCopied(true);
//       setTimeout(() => setCopied(false), 2000);
//     } catch (err) {
//       console.error("Copy failed", err);
//     }
//   };

//   const toggleFullScreen = (uid: number | null) => {
//     setFullScreenUser((prev) => (prev === uid ? null : uid));
//   };

//   const registerVideoRef = (uid: number, element: HTMLDivElement | null) => {
//     if (element) {
//       remoteVideoRefs.current.set(uid, element);
//       // Play immediately when ref is registered
//       const state = remoteUsers.get(uid);
//       if (state && state.hasVideo && state.user.videoTrack) {
//         const remoteVideo = state.user.videoTrack as IRemoteVideoTrack;

//         // Determine fit mode: contain for screen share, cover for camera
//         // We know from state if it's potentially a screen share.
//         // Also check "isScreen" flag we set during subscribe/update
//         const fitMode = state.isScreen ? "contain" : "cover";

//         try {
//           // Always try to play when ref is updated (re-mount)
//           if (remoteVideo.isPlaying) {
//             remoteVideo.stop();
//           }
//           remoteVideo.play(element, {
//             fit: fitMode,
//           });
//           log(
//             "Played remote video into newly registered element for",
//             uid,
//             "fit:",
//             fitMode,
//           );
//         } catch (err) {
//           console.warn("Error playing remote video after registering ref", err);
//         }
//       }
//     } else {
//       remoteVideoRefs.current.delete(uid);
//     }
//   };

//   // floating preview drag handlers
//   const clamp = (value: number, min: number, max: number) =>
//     Math.min(Math.max(value, min), max);

//   const onFloatStart = (clientX: number, clientY: number) => {
//     if (!floatRef.current) return;
//     const rect = floatRef.current.getBoundingClientRect();
//     dragStateRef.current = {
//       dragging: true,
//       startX: clientX - rect.left,
//       startY: clientY - rect.top,
//     };
//   };

//   const onFloatMouseDown = (e: MouseEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     onFloatStart(e.clientX, e.clientY);
//   };

//   const onFloatTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
//     // Prevent default to avoid immediate scroll/zoom during tap-drag init
//     // e.preventDefault();
//     const touch = e.touches[0];
//     onFloatStart(touch.clientX, touch.clientY);
//   };

//   useEffect(() => {
//     const getBounds = () => {
//       if (!floatRef.current) return { maxX: 0, maxY: 0 };
//       const rect = floatRef.current.getBoundingClientRect();
//       const winWidth = window.innerWidth;
//       const winHeight = window.innerHeight;
//       return {
//         maxX: winWidth - rect.width - 16,
//         maxY: winHeight - rect.height - 16,
//       };
//     };

//     const updatePosition = (x: number, y: number) => {
//       if (!floatRef.current) return;

//       const { maxX, maxY } = getBounds();
//       const minX = 16;
//       const minY = 16;

//       const clampedX = clamp(x, minX, maxX);
//       const clampedY = clamp(y, minY, maxY);

//       floatPos.current.x = clampedX;
//       floatPos.current.y = clampedY;

//       floatRef.current.style.transform = `translate(${clampedX}px, ${clampedY}px)`;
//     };

//     const handleMove = (clientX: number, clientY: number) => {
//       if (
//         !dragStateRef.current ||
//         !dragStateRef.current.dragging ||
//         !floatRef.current
//       )
//         return;

//       const x = clientX - dragStateRef.current.startX;
//       const y = clientY - dragStateRef.current.startY;

//       updatePosition(x, y);
//     };

//     const handleMouseMove = (e: globalThis.MouseEvent) => {
//       handleMove(e.clientX, e.clientY);
//     };

//     const handleTouchMove = (e: globalThis.TouchEvent) => {
//       if (dragStateRef.current && dragStateRef.current.dragging) {
//         e.preventDefault(); // Prevent scrolling while dragging
//         const touch = e.touches[0];
//         handleMove(touch.clientX, touch.clientY);
//       }
//     };

//     const handleEnd = () => {
//       if (dragStateRef.current) dragStateRef.current.dragging = false;
//     };

//     const handleResize = () => {
//       if (floatRef.current) {
//         // Re-clamp current position on resize
//         updatePosition(floatPos.current.x, floatPos.current.y);
//       }
//     };

//     window.addEventListener("mousemove", handleMouseMove);
//     window.addEventListener("mouseup", handleEnd);
//     window.addEventListener("touchmove", handleTouchMove, { passive: false });
//     window.addEventListener("touchend", handleEnd);
//     window.addEventListener("resize", handleResize);

//     // Initial clamp check in case window size is weird on mount
//     setTimeout(() => {
//       updatePosition(floatPos.current.x, floatPos.current.y);
//     }, 100);

//     return () => {
//       window.removeEventListener("mousemove", handleMouseMove);
//       window.removeEventListener("mouseup", handleEnd);
//       window.removeEventListener("touchmove", handleTouchMove);
//       window.removeEventListener("touchend", handleEnd);
//       window.removeEventListener("resize", handleResize);
//     };
//   }, []);

//   // Check if there's any screen share from remote users
//   const hasRemoteScreenShare = Array.from(remoteUsers.values()).some(
//     (user) => user.isScreen,
//   );

//   if (isLoading) return <PageLoading />;
//   if (isError) return <div>something went wrong</div>;

//   // --- Render functions ---
//   const renderFullScreenView = () => {
//     const fullScreenUserState = Array.from(remoteUsers.values()).find(
//       (user) => user.uid === fullScreenUser,
//     );

//     return (
//       <div className="absolute inset-0 flex flex-col bg-white animate-in fade-in zoom-in-95 duration-500 z-10">
//         <div className="flex-1 relative flex items-center justify-center md:p-4 overflow-hidden">
//           {fullScreenUserState && fullScreenUserState.hasVideo ? (
//             <div
//               ref={fullScreenVideoRef}
//               className={`w-full h-full max-h-full max-w-full overflow-hidden transition-all duration-500 rounded-3xl border border-slate-200 ${
//                 fullScreenUserState.isScreen
//                   ? "object-contain bg-black"
//                   : "object-cover bg-slate-900"
//               }`}
//             />
//           ) : (
//             <div className="flex flex-col items-center justify-center">
//               <div className="w-24 h-24 md:w-48 md:h-48 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center mb-8 ring-8 ring-slate-100/50">
//                 <VideoOff className="w-12 h-12 md:w-24 md:h-24 text-slate-300" />
//               </div>
//               <p className="text-xl md:text-3xl font-black text-slate-900 px-8 py-4 bg-white/80 rounded-3xl backdrop-blur-3xl border border-slate-200 shadow-sm uppercase tracking-tighter">
//                 Participant {fullScreenUser}
//               </p>
//             </div>
//           )}

//           {/* Controls Overlay- Clean Minimalist */}
//           <div className="absolute top-6 right-6 z-20">
//             <button
//               onClick={() => toggleFullScreen(null)}
//               className="p-4 bg-white/90 border border-slate-200 text-slate-900 rounded-full backdrop-blur-3xl transition-all hover:scale-110 active:scale-95 shadow-sm group"
//               title="Minimize"
//             >
//               <Minimize2 className="w-6 h-6 md:w-7 md:h-7 transition-transform group-hover:scale-75" />
//             </button>
//           </div>

//           {/* Label Overlay - High Contrast */}
//           {fullScreenUserState && (
//             <div className="absolute bottom-10 left-10 z-20 flex flex-col gap-3">
//               <div className="px-5 py-3 bg-white/95 backdrop-blur-3xl rounded-2xl border border-slate-300 flex items-center gap-4 shadow-sm">
//                 <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse shadow-[0_0_8px_rgba(37,99,235,0.4)]" />
//                 <span className="text-xs md:text-sm font-black text-slate-900 uppercase tracking-widest leading-none">
//                   USER {fullScreenUserState.uid}
//                 </span>
//                 {fullScreenUserState.isScreen && (
//                   <div className="flex items-center gap-2 px-3 py-1 bg-blue-700 text-white rounded-full transition-transform hover:scale-105">
//                     <MonitorUp className="w-4 h-4" />
//                     <span className="text-[10px] font-black uppercase tracking-widest leading-none">
//                       SCREEN
//                     </span>
//                   </div>
//                 )}
//               </div>
//               {!fullScreenUserState.hasAudio && (
//                 <div className="self-start px-4 py-2 bg-red-600 text-white border border-red-500 rounded-2xl flex items-center gap-2.5 shadow-sm">
//                   <MicOff className="w-4 h-4" />
//                   <span className="text-[10px] font-black uppercase tracking-[0.2em]">
//                     MUTED
//                   </span>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   const renderGridView = () => {
//     if (remoteUsers.size === 0) {
//       return (
//         <div className="flex-1 flex items-center justify-center p-4 bg-white">
//           <div className="text-center group">
//             <div className="w-20 h-20 md:w-32 md:h-32 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-100 transition-transform group-hover:scale-110 duration-500">
//               <Users className="w-8 h-8 md:w-16 md:h-16 text-slate-300" />
//             </div>
//             <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-2 uppercase tracking-tighter">
//               Waiting for Joiners
//             </h3>
//             <p className="text-slate-500 text-xs md:text-sm max-w-[280px] mx-auto leading-relaxed font-bold opacity-70">
//               Invite participants to start your collaboration session.
//             </p>
//           </div>
//         </div>
//       );
//     }

//     const userCount = remoteUsers.size;

//     return (
//       <div className="flex-1 w-full h-full p-2 md:p-4 lg:p-6 flex items-center justify-center overflow-hidden bg-white">
//         <div
//           className={`grid gap-4 md:gap-5 w-full h-full max-h-full ${
//             userCount === 1
//               ? "grid-cols-1"
//               : userCount === 2
//                 ? "grid-cols-1 md:grid-cols-2"
//                 : userCount <= 4
//                   ? "grid-cols-1 sm:grid-cols-2 max-w-full"
//                   : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
//           }`}
//         >
//           {Array.from(remoteUsers.values()).map((s) => (
//             <div
//               key={s.uid}
//               className="group relative bg-slate-50 rounded-2xl md:rounded-[2.5rem] overflow-hidden border border-slate-100 transition-all hover:border-blue-200 flex items-center justify-center shadow-none"
//             >
//               <div
//                 ref={(el) => registerVideoRef(s.uid, el)}
//                 className={`w-full h-full bg-slate-900 ${
//                   s.isScreen ? "object-contain" : "object-cover"
//                 } transition-all duration-500`}
//               />

//               {!s.hasVideo && (
//                 <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50">
//                   <div className="w-16 h-16 md:w-28 md:h-28 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm">
//                     <span className="text-slate-400 font-black text-xl md:text-5xl tracking-tighter opacity-80">
//                       {String(s.uid).slice(-2).toUpperCase()}
//                     </span>
//                   </div>
//                   <p className="mt-4 text-slate-400 text-[10px] md:text-xs font-black uppercase tracking-[0.3em] opacity-60">
//                     Connected
//                   </p>
//                 </div>
//               )}

//               {/* Top Controls Overlay - Enhanced Glassy */}
//               <div className="absolute top-2 right-2 md:top-5 md:right-5 flex items-center gap-1.5 md:gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all">
//                 {!s.hasAudio && (
//                   <div
//                     className="p-1.5 md:p-2.5 bg-red-500/90 text-white border border-red-400/30 rounded-full shadow-lg backdrop-blur-md"
//                     title="User is muted"
//                   >
//                     <MicOff className="w-3 h-3 md:w-4 md:h-4" />
//                   </div>
//                 )}
//                 <button
//                   onClick={() => toggleFullScreen(s.uid)}
//                   className="p-1.5 md:p-3 bg-white/40 backdrop-blur-xl border border-white/30 text-slate-900 rounded-full shadow-sm transition-all hover:scale-110 hover:bg-white/60 active:scale-95"
//                   title="Spotlight"
//                 >
//                   <Maximize2 className="w-3 h-3 md:w-4 md:h-4" />
//                 </button>
//               </div>

//               {/* Bottom Info Overlay - Professional Glassy */}
//               <div className="absolute bottom-2 left-2 md:bottom-6 md:left-6">
//                 <div className="px-2 md:px-5 py-1 md:py-2 bg-white/40 backdrop-blur-xl rounded-xl md:rounded-2xl border border-white/30 flex items-center gap-1.5 md:gap-3 shadow-sm">
//                   <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-600 rounded-full opacity-80" />
//                   <span className="text-[9px] md:text-xs font-black text-slate-900 tracking-wider uppercase">
//                     USER {s.uid}
//                   </span>
//                   {s.isScreen && (
//                     <div className="flex items-center gap-1 md:gap-1.5 px-1.5 md:px-2 py-0.5 bg-blue-600/90 text-white rounded-lg transition-transform hover:scale-105 backdrop-blur-sm">
//                       <MonitorUp className="w-2.5 h-2.5 md:w-4 md:h-4" />
//                       <span className="text-[7px] md:text-[9px] font-black uppercase tracking-widest leading-none">
//                         LIVE
//                       </span>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   };

//   const getMainContent = () => {
//     if (fullScreenUser !== null) {
//       return renderFullScreenView();
//     }

//     return (
//       <div className="flex-1 flex flex-col items-center justify-center overflow-auto h-full w-full">
//         {renderGridView()}
//       </div>
//     );
//   };

//   const renderShareModal = () => (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[2px] animate-in fade-in duration-300">
//       <div className="bg-white/90 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl p-8 max-w-sm w-full border border-white/50 animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 scale-100">
//         <div className="text-center mb-8">
//           <div className="w-16 h-16 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner ring-1 ring-blue-100">
//             <Share2 className="w-8 h-8 text-blue-600" />
//           </div>
//           <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-2">
//             Invite Others
//           </h4>
//           <p className="text-slate-500 text-xs font-bold leading-relaxed px-4">
//             Share the link below to bring collaborators into this professional
//             workspace.
//           </p>
//         </div>

//         <div className="relative group mb-8">
//           <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
//             <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
//           </div>
//           <input
//             readOnly
//             value={meetingLink}
//             className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-9 pr-4 py-4 text-xs font-mono text-blue-700 font-bold select-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer hover:bg-white"
//             onClick={(e) => (e.target as HTMLInputElement).select()}
//           />
//         </div>

//         <div className="flex flex-col gap-3">
//           <button
//             onClick={copyLink}
//             className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-black text-xs uppercase tracking-[0.2em] transition-all active:scale-[0.98] ${
//               copied
//                 ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
//                 : "bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700"
//             }`}
//           >
//             {copied ? (
//               <>
//                 <Check className="w-4 h-4" /> Copied!
//               </>
//             ) : (
//               <>
//                 <Copy className="w-4 h-4" /> Copy Link
//               </>
//             )}
//           </button>
//           <button
//             onClick={() => setShowShareModal(false)}
//             className="w-full py-4 rounded-2xl bg-white text-slate-500 font-black text-[10px] uppercase tracking-widest border border-slate-200 hover:bg-slate-50 transition-all"
//           >
//             Maybe Later
//           </button>
//         </div>
//       </div>
//     </div>
//   );

//   // --- UI: Pre-join view ---
//   if (!isJoined) {
//     return (
//       <div className="flex min-h-screen bg-white text-slate-800 items-center justify-center p-2 md:p-4 overflow-y-auto">
//         <div className="w-full max-w-4xl bg-white rounded-2xl md:rounded-3xl overflow-hidden border border-slate-100 shadow-sm my-auto">
//           <div className="grid grid-cols-1 md:grid-cols-2">
//             {/* Left: Video Preview */}
//             <div className="p-6 md:p-8 bg-slate-50/10">
//               <div className="aspect-video bg-slate-100 rounded-2xl overflow-hidden flex items-center justify-center relative border border-slate-200 group">
//                 <div
//                   ref={prejoinLocalRef}
//                   className="w-full h-full scale-x-[-1]"
//                 />
//                 {!isVideoOn && !isBeforeStart && (
//                   <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50">
//                     <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-3 border border-slate-200">
//                       <VideoOff className="w-10 h-10 text-slate-400" />
//                     </div>
//                     <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
//                       Camera Off
//                     </p>
//                   </div>
//                 )}
//                 {isBeforeStart && (
//                   <div className="absolute inset-0 flex flex-col items-center justify-center bg-transparent backdrop-blur-sm transition-all duration-500">
//                     <div className="flex flex-col items-center gap-4 md:gap-6 animate-fade-in px-4">
//                       <div className="relative">
//                         <div className="w-16 h-16 md:w-24 md:h-24 rounded-full border-2 border-black flex items-center justify-center">
//                           <Clock className="w-7 h-7 md:w-10 md:h-10 text-black animate-pulse" />
//                         </div>
//                         <div className="absolute inset-0 rounded-full border-t-2 border-blue-500 animate-spin" />
//                       </div>
//                       <div className="text-center">
//                         <p className="text-black text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] mb-2">
//                           Meeting Starts In
//                         </p>
//                         <p className="text-black text-2xl md:text-4xl font-mono font-black tracking-tighter">
//                           {formatCountdown(waitingTime)}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//                 {/* Overlay controls - Minimalist */}
//                 <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
//                   {/* <button
//                     onClick={toggleMic}
//                     className={`p-2.5 rounded-full backdrop-blur-3xl border shadow-sm ${isMicOn ? "bg-white/80 border-slate-200 text-slate-900" : "bg-red-500 text-white border-red-500"}`}
//                   >
//                     {isMicOn ? (
//                       <Mic className="w-4 h-4" />
//                     ) : (
//                       <MicOff className="w-4 h-4" />
//                     )}
//                   </button>
//                   <button
//                     onClick={toggleVideo}
//                     className={`p-2.5 rounded-full backdrop-blur-3xl border shadow-sm ${isVideoOn ? "bg-white/80 border-slate-200 text-slate-900" : "bg-red-500 text-white border-red-500"}`}
//                   >
//                     {isVideoOn ? (
//                       <Video className="w-4 h-4" />
//                     ) : (
//                       <VideoOff className="w-4 h-4" />
//                     )}
//                   </button> */}
//                 </div>
//               </div>

//               <div className="mt-8 flex items-center justify-center gap-6">
//                 <button
//                   onClick={toggleMic}
//                   className={`p-5 rounded-full transition-all border ${isMicOn ? "bg-white hover:bg-slate-50 text-slate-900 border-slate-200 shadow-sm" : "bg-red-500 text-white border-red-500 shadow-lg shadow-red-500/20"}`}
//                 >
//                   {isMicOn ? (
//                     <Mic className="w-6 h-6" />
//                   ) : (
//                     <MicOff className="w-6 h-6" />
//                   )}
//                 </button>
//                 <button
//                   onClick={toggleVideo}
//                   className={`p-5 rounded-full transition-all border ${isVideoOn ? "bg-white hover:bg-slate-50 text-slate-900 border-slate-200 shadow-sm" : "bg-red-500 text-white border-red-500 shadow-lg shadow-red-500/20"}`}
//                 >
//                   {isVideoOn ? (
//                     <Video className="w-6 h-6" />
//                   ) : (
//                     <VideoOff className="w-6 h-6" />
//                   )}
//                 </button>
//               </div>
//             </div>

//             {/* Right: Info & Join */}
//             <div className="p-8 md:p-10 flex flex-col justify-center bg-white">
//               <h1 className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-tighter">
//                 Ready?
//               </h1>
//               <p className="text-slate-500 text-xs mb-8 font-bold leading-relaxed">
//                 Step into the professional workspace. ID:{" "}
//                 <span
//                   className="text-blue-700 font-mono select-all ml-1 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer"
//                   onClick={() => {
//                     navigator.clipboard.writeText(channelName);
//                     setCopied(true);
//                     setTimeout(() => setCopied(false), 2000);
//                   }}
//                 >
//                   {channelName}
//                 </span>
//               </p>

//               {error && (
//                 <div className="mb-6 p-4 rounded-xl border border-red-200 bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-3 animate-shake">
//                   <AlertTriangle className="w-4 h-4 flex-shrink-0" />
//                   {error}
//                 </div>
//               )}

//               <div className="flex flex-col gap-4">
//                 <button
//                   onClick={joinMeeting}
//                   disabled={isJoining || isGenerating || isBeforeStart}
//                   className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 font-black text-xs uppercase tracking-[0.2em] transition-all active:scale-[0.98] shadow-lg shadow-blue-600/10"
//                 >
//                   {isJoining || isGenerating ? (
//                     <Loader2 className="w-5 h-5 animate-spin mx-auto" />
//                   ) : isBeforeStart ? (
//                     "Waiting to Start..."
//                   ) : (
//                     "Join Session"
//                   )}
//                 </button>
//                 <button
//                   onClick={() => router.push("/meeting")}
//                   className="w-full py-3 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-500 font-black text-[10px] uppercase tracking-widest border border-slate-200 transition-all"
//                 >
//                   Go Back
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//         {showShareModal && renderShareModal()}
//       </div>
//     );
//   }

//   // --- Meeting UI when joined ---
//   return (
//     <div className="fixed inset-0 bg-white flex flex-col overflow-hidden text-slate-900 selection:bg-blue-500/10">
//       {showShareModal && renderShareModal()}

//       {/* Header: Enhanced Glassy Responsive Bar */}
//       <div
//         className={`absolute top-0 left-0 right-0 z-30 p-2 md:p-6 pointer-events-none flex justify-center transition-all duration-700 ease-in-out ${
//           showControls
//             ? "translate-y-0 opacity-100"
//             : "-translate-y-full opacity-0"
//         }`}
//       >
//         <div className="max-w-[98vw] w-fit pointer-events-auto flex items-center gap-1.5 md:gap-4 px-2.5 md:px-5 py-1.5 md:py-2.5 bg-white/40 backdrop-blur-2xl border border-white/30 rounded-full shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] transition-all duration-500 hover:bg-white/60">
//           {/* Badge Section */}
//           <div className="flex items-center gap-1.5 px-2 md:px-2.5 py-0.5 md:py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full shrink-0">
//             <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
//             <span className="hidden md:inline text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none">
//               LIVE
//             </span>
//           </div>

//           <div className="w-px h-3 md:h-4 bg-slate-300/40 shrink-0" />

//           {/* User Count */}
//           <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
//             <Users className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-600" />
//             <span className="text-[11px] md:text-sm font-black text-slate-900">
//               {remoteUsers.size + 1}
//             </span>
//           </div>

//           <div className="w-px h-3 md:h-4 bg-slate-300/40 shrink-0" />

//           {/* Timer: Integrated into main bar */}
//           <MeetingTimer startTime={startTime || undefined} onEnd={leaveCall} />

//           <div className="w-px h-3 md:h-4 bg-slate-300/40 shrink-0" />

//           {/* Channel ID: Truncated on mobile */}
//           <div
//             className="flex items-center gap-2 font-mono text-[9px] md:text-xs text-blue-600 font-black select-all cursor-pointer bg-blue-50/30 hover:bg-blue-100/50 px-1.5 md:px-2 py-0.5 md:py-1 rounded-lg transition-all border border-blue-100/20 max-w-[60px] xs:max-w-[80px] md:max-w-none overflow-hidden text-ellipsis whitespace-nowrap"
//             onClick={() => setShowShareModal(true)}
//             title={channelName}
//           >
//             {channelName}
//           </div>

//           {fullScreenUser && (
//             <>
//               <div className="w-px h-3 md:h-4 bg-slate-300/40 shrink-0 hidden md:block" />
//               <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-full animate-fade-in shadow-lg shadow-blue-600/20">
//                 <Maximize2 className="w-3 h-3" />
//                 <span className="text-[9px] uppercase font-black tracking-widest">
//                   SPOTLIGHT
//                 </span>
//               </div>
//             </>
//           )}
//         </div>
//       </div>

//       {/* Main Container */}
//       <div className="flex-1 relative bg-white">{getMainContent()}</div>

//       {/* Floating Preview: Minimalist High-Contrast */}
//       {fullScreenUser === null && (
//         <div
//           ref={floatRef}
//           onMouseDown={onFloatMouseDown}
//           onTouchStart={onFloatTouchStart}
//           style={{
//             position: "fixed",
//             top: 0,
//             left: 0,
//             transform: `translate(${floatPos.current.x}px, ${floatPos.current.y}px)`,
//             zIndex: 40,
//           }}
//           className={`w-36 h-24 md:w-64 md:h-40 bg-white border border-slate-200 rounded-xl md:rounded-2xl cursor-grab active:cursor-grabbing overflow-hidden group transition-all duration-700 ease-in-out hover:scale-[1.02] touch-none shadow-sm ${
//             showControls
//               ? "opacity-100 scale-100"
//               : "opacity-0 scale-95 pointer-events-none"
//           }`}
//         >
//           <div className="w-full h-full relative">
//             <div
//               ref={floatingPreviewRef}
//               className="w-full h-full bg-slate-100 scale-x-[-1]"
//               style={{ pointerEvents: "none" }}
//             />
//             {!isVideoOn && !isScreenSharing && (
//               <div className="absolute inset-0 flex items-center justify-center bg-slate-50">
//                 <div className="w-8 h-8 md:w-16 md:h-16 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200">
//                   <VideoOff className="w-4 h-4 md:w-8 md:h-8 text-slate-400" />
//                 </div>
//               </div>
//             )}
//             <div className="absolute bottom-2 left-2 flex items-center gap-1.5 px-2 py-0.5 md:py-1 bg-white/90 backdrop-blur-md rounded-lg border border-slate-200 shadow-sm">
//               <span className="text-[9px] md:text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">
//                 YOU
//               </span>
//               {isScreenSharing && (
//                 <MonitorUp className="w-2.5 h-2.5 text-blue-700" />
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Control Bar: Flatter minimalist dock (No heavy shadow) */}
//       <div
//         className={`fixed bottom-6 left-0 right-0 z-30 px-4 flex justify-center pointer-events-none transition-all duration-700 ease-in-out ${
//           showControls
//             ? "translate-y-0 opacity-100"
//             : "translate-y-[200%] opacity-0"
//         }`}
//       >
//         <div className="bg-white/80 backdrop-blur-3xl px-4 md:px-6 py-3.5 rounded-[2rem] border border-slate-200 flex items-center gap-3 md:gap-5 pointer-events-auto transition-transform hover:scale-[1.01] shadow-sm">
//           <button
//             onClick={toggleMic}
//             className={`p-3 md:p-4 rounded-full transition-all ring-offset-2 ${
//               isMicOn
//                 ? "bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-200"
//                 : "bg-red-500 text-white shadow-lg shadow-red-500/10 active:scale-95"
//             }`}
//           >
//             {isMicOn ? (
//               <Mic className="w-5 h-5 md:w-5 md:h-5" />
//             ) : (
//               <MicOff className="w-5 h-5 md:w-5 md:h-5" />
//             )}
//           </button>

//           <button
//             onClick={toggleVideo}
//             className={`p-3 md:p-4 rounded-full transition-all ring-offset-2 ${
//               isVideoOn
//                 ? "bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-200"
//                 : "bg-red-500 text-white shadow-lg shadow-red-500/10 active:scale-95"
//             }`}
//           >
//             {isVideoOn ? (
//               <Video className="w-5 h-5 md:w-5 md:h-5" />
//             ) : (
//               <VideoOff className="w-5 h-5 md:w-5 md:h-5" />
//             )}
//           </button>

//           <button
//             onClick={toggleScreenShare}
//             className={`p-3 md:p-4 rounded-full transition-all ring-offset-2 ${
//               isScreenSharing
//                 ? "bg-blue-600 text-white ring-2 ring-blue-600/10"
//                 : "bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-200"
//             }`}
//           >
//             <MonitorUp className={`w-5 h-5 md:w-5 md:h-5`} />
//           </button>

//           <div className="h-8 w-px bg-slate-200 mx-1" />

//           <button
//             onClick={leaveCall}
//             className="p-3 md:p-4 rounded-full bg-red-500 text-white shadow-xl shadow-red-500/10 transition-all hover:rotate-12 active:scale-90"
//           >
//             <PhoneOff className="w-5 h-5 md:w-5 md:h-5" />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }



"use client";
// import PageLoading from "@/components/ui/Loading";
import { useGenerateAgoraTokenMutation } from "../(apis)/api";
// import { useGetUserQuery } from "@/lib/api/users/userApi";
import AgoraRTC, {
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  ILocalAudioTrack,
  ILocalVideoTrack,
  IRemoteAudioTrack,
  IRemoteVideoTrack,
} from "agora-rtc-sdk-ng";
import {
  AlertTriangle,
  Check,
  Clock,
  Copy,
  Loader2,
  Maximize2,
  Mic,
  MicOff,
  Minimize2,
  MonitorUp,
  PhoneOff,
  Share2,
  Users,
  Video,
  VideoOff,
} from "lucide-react";
import MeetingTimer from "../(components)/MeetingTimer";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, {
  MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useGetMeQuery } from "@/redux/api/authApi";
import PageLoading from "@/components/shared/PageLoading";

// Add some basic CSS for animations directly
const meetingStyles = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-4px); }
    75% { transform: translateX(4px); }
  }
  .animate-shake { animation: shake 0.4s ease-in-out; }
  .animate-fade-in { animation: fadeIn 0.5s ease-out; }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  body { overflow: hidden !important; }
`;

type RemoteUserState = {
  user: IAgoraRTCRemoteUser;
  hasVideo: boolean;
  hasAudio: boolean;
  uid: number;
  isScreen?: boolean;
};

const RETRY_SUBSCRIBE_MS = 700;
const MAX_SUBSCRIBE_RETRIES = 4;

export default function MeetingRoom() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const channelName = (params?.channelName || "") as string;
  const startTime = searchParams?.get("start");

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: meetingStyles }} />
      <MeetingContent
        channelName={channelName}
        startTime={startTime}
        router={router}
      />
    </>
  );
}

function MeetingContent({
  channelName,
  startTime,
  router,
}: {
  channelName: string;
  startTime: string | null;
  router: any;
}) {
  const [generateToken, { isLoading: isGenerating }] =
    useGenerateAgoraTokenMutation();

  const { data, isLoading, isError } = useGetMeQuery(undefined);
  const usersId = data?.data?.id;

  // Agora refs
  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const localVideoTrackRef = useRef<ILocalVideoTrack | null>(null);
  const localAudioTrackRef = useRef<ILocalAudioTrack | null>(null);
  const screenTrackRef = useRef<ILocalVideoTrack | null>(null);
  const hasInitialized = useRef(false);
  const isLeavingRef = useRef(false);

  // DOM refs
  const prejoinLocalRef = useRef<HTMLDivElement | null>(null);
  const floatingPreviewRef = useRef<HTMLDivElement | null>(null);
  const remoteVideoRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const fullScreenVideoRef = useRef<HTMLDivElement | null>(null);

  // UI state
  const [isJoined, setIsJoined] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [remoteUsers, setRemoteUsers] = useState<Map<number, RemoteUserState>>(
    new Map(),
  );
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [fullScreenUser, setFullScreenUser] = useState<number | null>(null);
  const [waitingTime, setWaitingTime] = useState<number>(0);
  const [isBeforeStart, setIsBeforeStart] = useState<boolean>(false);
  const [showControls, setShowControls] = useState(true);

  // inactivity timeout
  const activityTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleActivity = useCallback(() => {
    setShowControls(true);
    if (activityTimeoutRef.current) clearTimeout(activityTimeoutRef.current);
    activityTimeoutRef.current = setTimeout(() => {
      // Only hide if modal is not open
      setShowControls(false);
    }, 3000);
  }, []);

  // Update activity based on mouse/touch
  useEffect(() => {
    if (isJoined && !showShareModal) {
      window.addEventListener("mousemove", handleActivity);
      window.addEventListener("mousedown", handleActivity);
      window.addEventListener("touchstart", handleActivity);
      window.addEventListener("scroll", handleActivity);

      handleActivity();

      return () => {
        window.removeEventListener("mousemove", handleActivity);
        window.removeEventListener("mousedown", handleActivity);
        window.removeEventListener("touchstart", handleActivity);
        window.removeEventListener("scroll", handleActivity);
        if (activityTimeoutRef.current)
          clearTimeout(activityTimeoutRef.current);
      };
    } else {
      setShowControls(true);
      if (activityTimeoutRef.current) clearTimeout(activityTimeoutRef.current);
    }
  }, [isJoined, showShareModal, handleActivity]);

  // floating preview drag
  const floatRef = useRef<HTMLDivElement | null>(null);
  const floatPos = useRef({ x: 16, y: window.innerHeight - 160 }); // Initial approx position used until mounted effect adjustments
  const dragStateRef = useRef<{
    dragging: boolean;
    startX: number;
    startY: number;
  } | null>(null);

  // meeting link
  const meetingLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/meeting/${channelName}${startTime ? `?start=${startTime}` : ""}`
      : "";

  // --- Pre-meeting logic ---
  useEffect(() => {
    if (!startTime) return;

    const targetDate = new Date(startTime).getTime();

    const checkTime = () => {
      const now = Date.now();
      const diff = Math.floor((targetDate - now) / 1000);

      if (diff > 0) {
        setIsBeforeStart(true);
        setWaitingTime(diff);
      } else {
        setIsBeforeStart(false);
        setWaitingTime(0);
      }
    };

    checkTime();
    const interval = setInterval(checkTime, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  const formatCountdown = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return [
      hrs > 0 ? String(hrs).padStart(2, "0") : null,
      String(mins).padStart(2, "0"),
      String(secs).padStart(2, "0"),
    ]
      .filter(Boolean)
      .join(":");
  };

  // --- Helper functions ---
  const log = useCallback((...args: unknown[]) => {
    console.log("[AgoraMeeting]", ...args);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // --- Cleanup functions ---
  const cleanupLocalTracks = useCallback(async () => {
    try {
      if (screenTrackRef.current) {
        screenTrackRef.current.close();
        screenTrackRef.current = null;
      }
      if (localAudioTrackRef.current) {
        localAudioTrackRef.current.close();
        localAudioTrackRef.current = null;
      }
      if (localVideoTrackRef.current) {
        localVideoTrackRef.current.close();
        localVideoTrackRef.current = null;
      }
    } catch (err) {
      console.error("Error cleaning up local tracks:", err);
    }
  }, []);

  const cleanupClient = useCallback(async () => {
    const client = clientRef.current;
    if (!client) return;

    try {
      if (client.connectionState !== "DISCONNECTED") {
        await client.leave();
        log("Left channel");
      }
    } catch (err) {
      console.error("Error leaving client:", err);
    }
  }, [log]);

  // --- Track management ---
  const stopScreenShare = useCallback(async () => {
    const client = clientRef.current;
    const screenTrack = screenTrackRef.current;

    if (!client) return;

    try {
      // Unpublish screen track if exists
      if (screenTrack) {
        await client.unpublish([screenTrack]);
        screenTrack.close();
        screenTrackRef.current = null;
        log("Stopped and unpublished screen track");
      }

      // Publish camera track again if we have one
      if (localVideoTrackRef.current) {
        try {
          // Agora doesn't allow publishing disabled tracks
          await localVideoTrackRef.current.setEnabled(true);
          await client.publish([localVideoTrackRef.current]);
          // Restore state
          await localVideoTrackRef.current.setEnabled(isVideoOn);
          log("Re-published camera track after stopping screen");
        } catch (publishErr) {
          console.error("Error publishing camera track:", publishErr);
        }

        // Update floating preview to show camera
        if (floatingPreviewRef.current) {
          try {
            if (localVideoTrackRef.current.isPlaying) {
              localVideoTrackRef.current.stop();
            }
            localVideoTrackRef.current.play(floatingPreviewRef.current, {
              fit: "cover",
            });
            log("Updated floating preview to show camera");
          } catch (playErr) {
            console.warn("Could not play camera in floating preview:", playErr);
          }
        }
      }

      setIsScreenSharing(false);
    } catch (err) {
      console.error("Error stopping screen share:", err);
      setError("Error stopping screen share. Please try again.");
      setTimeout(clearError, 3000);
    }
  }, [log, clearError]);

  // --- Helper to attempt subscribe with retries ---
  const retrySubscribe = useCallback(
    async (
      client: IAgoraRTCClient,
      user: IAgoraRTCRemoteUser,
      mediaType: "video" | "audio",
      attempt: number,
    ) => {
      try {
        log(
          `Attempt subscribe ${attempt} -> user:${user.uid} media:${mediaType}`,
        );
        await client.subscribe(user, mediaType);
        log("Subscribed to remote user:", user.uid, mediaType);

        const uidNum = Number(user.uid);

        if (mediaType === "video") {
          const remoteVideo = user.videoTrack as IRemoteVideoTrack | undefined;

          // Check if it's screen share
          let isScreen = false;
          if (remoteVideo) {
            const track = remoteVideo as unknown as {
              track?: { label?: string };
              isScreen?: boolean;
            };
            const label = track.track?.label?.toLowerCase?.() || "";
            isScreen = label.includes("screen") || track.isScreen || false;
          }

          setRemoteUsers((prev) => {
            const copy = new Map(prev);
            const existing = copy.get(uidNum);
            if (existing) {
              copy.set(uidNum, {
                ...existing,
                user,
                hasVideo: true,
                isScreen: isScreen || existing.isScreen,
              });
            } else {
              copy.set(uidNum, {
                user,
                hasVideo: true,
                hasAudio: !!user.audioTrack,
                uid: uidNum,
                isScreen,
              });
            }
            return copy;
          });

          // Play remote video into registered DOM node if available
          const videoRef = remoteVideoRefs.current.get(uidNum);
          if (remoteVideo && videoRef) {
            try {
              remoteVideo.play(videoRef, {
                fit: "cover",
              });
            } catch (err) {
              console.warn("Could not play remote video immediately", err);
            }
          }
        } else if (mediaType === "audio") {
          const remoteAudio = user.audioTrack as IRemoteAudioTrack | undefined;
          if (remoteAudio) {
            remoteAudio.play();
          }

          setRemoteUsers((prev) => {
            const copy = new Map(prev);
            const existing = copy.get(uidNum);
            if (existing) {
              copy.set(uidNum, {
                ...existing,
                hasAudio: true,
                user,
              });
            } else {
              copy.set(uidNum, {
                user,
                hasVideo: !!user.videoTrack,
                hasAudio: true,
                uid: uidNum,
                isScreen: false,
              });
            }
            return copy;
          });
        }
      } catch (err) {
        console.warn(
          "Subscribe failed for user",
          user.uid,
          "media",
          mediaType,
          "attempt",
          attempt,
          err,
        );
        if (attempt < MAX_SUBSCRIBE_RETRIES) {
          setTimeout(
            () => retrySubscribe(client, user, mediaType, attempt + 1),
            RETRY_SUBSCRIBE_MS * (attempt + 1),
          );
        } else {
          console.error(
            "Max subscribe retries reached for",
            user.uid,
            mediaType,
          );
        }
      }
    },
    [log],
  );

  // --- Event handlers ---
  const handleUserJoined = useCallback(
    (user: IAgoraRTCRemoteUser) => {
      log("user-joined:", user.uid);
      const uidNum = Number(user.uid);
      setRemoteUsers((prev) => {
        const copy = new Map(prev);
        const existing = copy.get(uidNum);

        if (existing) {
          copy.set(uidNum, {
            ...existing,
            user,
            hasVideo: !!user.videoTrack || existing.hasVideo,
            hasAudio: !!user.audioTrack || existing.hasAudio,
          });
        } else {
          copy.set(uidNum, {
            user,
            hasVideo: !!user.videoTrack,
            hasAudio: !!user.audioTrack,
            uid: uidNum,
            isScreen: false,
          });
        }
        return copy;
      });
    },
    [log],
  );

  const handleUserPublished = useCallback(
    async (user: IAgoraRTCRemoteUser, mediaType: string) => {
      log("user-published event:", user.uid, mediaType);
      const client = clientRef.current;
      if (client) {
        await retrySubscribe(client, user, mediaType as "video" | "audio", 0);
      }
    },
    [retrySubscribe, log],
  );

  const handleUserUnpublished = useCallback(
    (user: IAgoraRTCRemoteUser, mediaType: string) => {
      log("user-unpublished:", user.uid, mediaType);
      const uidNum = Number(user.uid);
      setRemoteUsers((prev) => {
        const copy = new Map(prev);
        const existing = copy.get(uidNum);
        if (!existing) return prev;

        copy.set(uidNum, {
          ...existing,
          hasVideo: mediaType === "video" ? false : existing.hasVideo,
          hasAudio: mediaType === "audio" ? false : existing.hasAudio,
        });
        return copy;
      });
    },
    [log],
  );

  const handleUserLeft = useCallback(
    (user: IAgoraRTCRemoteUser) => {
      log("user-left:", user.uid);
      const uidNum = Number(user.uid);
      setRemoteUsers((prev) => {
        const copy = new Map(prev);
        copy.delete(uidNum);
        return copy;
      });
      setFullScreenUser((prev) => (prev === uidNum ? null : prev));
    },
    [log],
  );

  // --- Create pre-join preview tracks ---
  useEffect(() => {
    let mounted = true;

    const createPrejoinTracks = async () => {
      if (!mounted) return;

      try {
        log("Creating prejoin preview tracks");

        // Create video track first (camera) - Optional
        if (!localVideoTrackRef.current) {
          try {
            const cameraTrack = await AgoraRTC.createCameraVideoTrack({
              encoderConfig: { width: 640, height: 480, frameRate: 30 },
            });

            if (!mounted) {
              cameraTrack.close();
              return;
            }

            localVideoTrackRef.current = cameraTrack;
            await cameraTrack.setEnabled(true);

            // Wait for DOM element to be available
            const waitForElement = () => {
              if (prejoinLocalRef.current && mounted) {
                try {
                  cameraTrack.play(prejoinLocalRef.current, {
                    fit: "cover",
                  });
                  log("Local camera preview playing in prejoin element");
                } catch (playErr) {
                  console.warn("Could not play in prejoin element:", playErr);
                  if (mounted) setTimeout(waitForElement, 100);
                }
              } else if (mounted) {
                setTimeout(waitForElement, 100);
              }
            };
            waitForElement();
            log("Local camera preview ready");
          } catch (cameraErr) {
            console.warn(
              "Camera hardware missing or permission denied:",
              cameraErr,
            );
            // Non-blocking warning
          }
        }

        // Create audio track - Optional
        if (!localAudioTrackRef.current) {
          try {
            const micTrack = await AgoraRTC.createMicrophoneAudioTrack();
            if (!mounted) {
              micTrack.close();
              return;
            }
            localAudioTrackRef.current = micTrack;
            await micTrack.setEnabled(false); // Start muted
            log("Local microphone preview ready");
          } catch (micErr) {
            console.warn(
              "Microphone hardware missing or permission denied:",
              micErr,
            );
          }
        }
      } catch (err: unknown) {
        console.error("Critical prejoin track error:", err);
      }
    };

    createPrejoinTracks();

    return () => {
      mounted = false;
    };
  }, [log]);

  // Re-attach video to prejoin element when ref changes
  useEffect(() => {
    if (prejoinLocalRef.current && localVideoTrackRef.current && !isJoined) {
      try {
        if (localVideoTrackRef.current.isPlaying) {
          localVideoTrackRef.current.stop();
        }
        localVideoTrackRef.current.play(prejoinLocalRef.current, {
          fit: "cover",
        });
      } catch (err) {
        console.warn("Error re-attaching prejoin video:", err);
      }
    }
  }, [isJoined]);

  // --- Initialize Agora client (only once) ---
  useEffect(() => {
    if (!channelName || hasInitialized.current) return;
    hasInitialized.current = true;

    const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
    clientRef.current = client;

    log("Client created for channel:", channelName);

    // Dynamic listeners using refs/callback stable versions
    client.on("connection-state-change", (cur, rev) => {
      log("Connection state change:", cur, rev);
    });

    client.on("user-joined", (u) => handleUserJoined(u));
    client.on("user-published", (u, m) => handleUserPublished(u, m));
    client.on("user-unpublished", (u, m) => handleUserUnpublished(u, m));
    client.on("user-left", (u) => handleUserLeft(u));

    client.on("exception", (evt) => {
      log("client exception:", evt);
    });
  }, [
    channelName,
    log,
    handleUserJoined,
    handleUserPublished,
    handleUserUnpublished,
    handleUserLeft,
  ]);

  // Dedicated cleanup effect for UNMOUNT ONLY
  useEffect(() => {
    return () => {
      if (isLeavingRef.current) return;
      const cleanup = async () => {
        try {
          log("Cleaning up client on unmount");
          await cleanupLocalTracks();
          await cleanupClient();
        } catch (err) {
          console.error("Cleanup error:", err);
        }
      };
      cleanup();
    };
  }, [cleanupLocalTracks, cleanupClient, log]);

  // Consolidated Video Playback Controller
  useEffect(() => {
    const playTrack = async (
      track: IRemoteVideoTrack,
      element: HTMLDivElement,
      fit: "cover" | "contain",
      uid: number,
    ) => {
      try {
        // Agora's .play() is async and can throw AbortError if interrupted
        await track.play(element, { fit });
        log("Playing video for", uid, "fit:", fit);
      } catch (err: any) {
        // Silently handle AbortError as it's just a playback interruption
        if (err.name !== "AbortError") {
          console.warn("Playback error for user", uid, err);
        }
      }
    };

    remoteUsers.forEach((state) => {
      if (!state.hasVideo || !state.user.videoTrack) return;

      const remoteVideo = state.user.videoTrack as IRemoteVideoTrack;
      const isSpotlighted = fullScreenUser === state.uid;

      // Determine the correct target element and fit mode
      const targetElement = isSpotlighted
        ? fullScreenVideoRef.current
        : remoteVideoRefs.current.get(state.uid);

      if (targetElement) {
        const fitMode = isSpotlighted || state.isScreen ? "contain" : "cover";
        playTrack(remoteVideo, targetElement, fitMode, state.uid);
      }
    });
  }, [remoteUsers, fullScreenUser, log]);

  // Update floating preview when video track changes (or when exiting spotlight)
  useEffect(() => {
    if (isJoined && floatingPreviewRef.current && fullScreenUser === null) {
      const currentTrack = isScreenSharing
        ? screenTrackRef.current
        : localVideoTrackRef.current;

      if (currentTrack && floatingPreviewRef.current) {
        try {
          if (currentTrack.isPlaying) {
            currentTrack.stop();
          }
          currentTrack.play(floatingPreviewRef.current, {
            fit: isScreenSharing ? "contain" : "cover",
          });
          log("Restored local video in floating preview");
        } catch (err) {
          console.error("Error updating local preview:", err);
        }
      }
    }
  }, [isJoined, isScreenSharing, fullScreenUser, log]);

  // --- Action functions ---
  const joinMeeting = async () => {
    setIsJoining(true);
    setError(null);
    const client = clientRef.current;
    if (!client) {
      setError("RTC client not ready");
      setIsJoining(false);
      return;
    }

    try {
      const userId = usersId || Math.random().toString(36).substring(2, 15);
      const role = "publisher";
      log("Requesting token for channel:", channelName, "userId:", userId);

      const response = await generateToken({
        channelName,
        userId,
        role,
      }).unwrap();

      if (!response.success || !response.data) {
        throw new Error(response.message || "Token generation failed");
      }

      const cfg = {
        appId: response.data.appId,
        token: response.data.token,
        channel: response.data.channelName,
        uid: response.data.uid,
      };

      log("Joining channel:", cfg.channel, "uid:", cfg.uid);

      // join
      await client.join(cfg.appId, cfg.channel, cfg.token, cfg.uid);
      log("Successfully joined channel:", cfg.channel);

      // Sync existing users immediately after joining
      setRemoteUsers(() => {
        const map = new Map<number, RemoteUserState>();
        client.remoteUsers.forEach((user) => {
          const u = Number(user.uid);
          map.set(u, {
            user,
            hasVideo: !!user.videoTrack,
            hasAudio: !!user.audioTrack,
            uid: u,
            isScreen: false,
          });
        });
        return map;
      });

      // Process audio track - Optional
      if (!localAudioTrackRef.current) {
        try {
          const mic = await AgoraRTC.createMicrophoneAudioTrack();
          localAudioTrackRef.current = mic;
        } catch (micErr) {
          console.warn("Could not create mic track on join:", micErr);
          // Don't set isMicOn to false yet, just log it.
          // We'll handle the absence of track during publish.
        }
      }

      if (localAudioTrackRef.current) {
        try {
          // Agora doesn't allow publishing disabled tracks
          await localAudioTrackRef.current.setEnabled(true);
          await client.publish([localAudioTrackRef.current]);
          // Restore user's intended state
          await localAudioTrackRef.current.setEnabled(isMicOn);
          log("Published audio track");
        } catch (pubErr) {
          console.error("Audio publish failed:", pubErr);
        }
      }

      // Process video track - Optional
      if (!localVideoTrackRef.current) {
        try {
          const cam = await AgoraRTC.createCameraVideoTrack({
            encoderConfig: { width: 640, height: 480, frameRate: 30 },
          });
          localVideoTrackRef.current = cam;
        } catch (camErr) {
          console.warn("Could not create cam track on join:", camErr);
        }
      }

      if (localVideoTrackRef.current) {
        try {
          // Agora doesn't allow publishing disabled tracks
          await localVideoTrackRef.current.setEnabled(true);
          await client.publish([localVideoTrackRef.current]);
          // Restore user's intended state
          await localVideoTrackRef.current.setEnabled(isVideoOn);
          log("Published video track");

          if (floatingPreviewRef.current) {
            localVideoTrackRef.current.play(floatingPreviewRef.current, {
              fit: "cover",
            });
          }
        } catch (pubErr) {
          console.error("Video publish failed:", pubErr);
        }
      }

      setIsJoined(true);
      setShowShareModal(true);
    } catch (err: unknown) {
      console.error("Error joining meeting:", err);
      let msg = "Failed to join meeting. Please try again.";
      if (err instanceof Error) {
        const message = err.message;
        if (message.includes("PERMISSION_DENIED")) {
          msg = "Camera/microphone permission denied.";
        } else if (
          message.includes("NotFoundError") ||
          message.includes("NOT_FOUND")
        ) {
          msg = "Camera or microphone not found.";
        } else {
          msg = message;
        }
      }
      setError(msg);
    } finally {
      setIsJoining(false);
    }
  };

  const toggleMic = async () => {
    try {
      const audio = localAudioTrackRef.current;
      if (!audio) {
        try {
          const mic = await AgoraRTC.createMicrophoneAudioTrack();
          localAudioTrackRef.current = mic;
          await mic.setEnabled(true);
          setIsMicOn(true);
          if (isJoined && clientRef.current) {
            await clientRef.current.publish([mic]);
          }
          return;
        } catch (err) {
          log("Could not start microphone:", err);
          setError("Microphone not found or permission denied.");
          setTimeout(clearError, 3000);
          return;
        }
      }
      const newState = !isMicOn;
      await audio.setEnabled(newState);
      setIsMicOn(newState);
      log("Toggled mic. Now isMicOn:", newState);
    } catch (err) {
      console.error("Error toggling mic:", err);
      setError("Cannot toggle microphone.");
      setTimeout(clearError, 3000);
    }
  };

  const toggleVideo = async () => {
    try {
      const video = localVideoTrackRef.current;
      const newState = !isVideoOn;

      if (!video) {
        try {
          const cam = await AgoraRTC.createCameraVideoTrack({
            encoderConfig: { width: 640, height: 480, frameRate: 30 },
          });
          localVideoTrackRef.current = cam;
          if (prejoinLocalRef.current) {
            cam.play(prejoinLocalRef.current, { fit: "cover" });
          }
          await cam.setEnabled(true);
          setIsVideoOn(true);
          if (isJoined && clientRef.current) {
            await clientRef.current.publish([cam]);
            if (floatingPreviewRef.current) {
              cam.play(floatingPreviewRef.current, { fit: "cover" });
            }
          }
          return;
        } catch (err) {
          log("Could not start camera:", err);
          setError("Camera not found or permission denied.");
          setTimeout(clearError, 3000);
          return;
        }
      }

      await video.setEnabled(newState);
      setIsVideoOn(newState);
      log("Toggled video. Now isVideoOn:", newState);
    } catch (err) {
      console.error("Error toggling video:", err);
      setError("Cannot toggle camera.");
      setTimeout(clearError, 3000);
    }
  };

  const toggleScreenShare = async () => {
    const client = clientRef.current;
    if (!client) return;

    try {
      if (!isScreenSharing) {
        log("Starting screen share: creating screen track");
        const screenTrack = await AgoraRTC.createScreenVideoTrack({
          encoderConfig: "1080p_1",
        });
        screenTrackRef.current = screenTrack as ILocalVideoTrack;

        // Unpublish camera track and publish screen track
        if (localVideoTrackRef.current) {
          try {
            await client.unpublish([localVideoTrackRef.current]);
            log("Unpublished camera track to publish screen only");
          } catch (e) {
            console.warn(
              "Could not unpublish camera before publishing screen",
              e,
            );
          }
        }

        await client.publish([screenTrack as ILocalVideoTrack]);
        log("Published screen track to channel");

        // Play screen share preview in floating window for the sharer
        if (floatingPreviewRef.current && screenTrackRef.current) {
          try {
            screenTrackRef.current.play(floatingPreviewRef.current, {
              fit: "contain",
            });
            log("Screen track playing in floating preview for presenter");
          } catch (e) {
            console.warn("Could not play screen in floating preview", e);
          }
        }

        (screenTrack as ILocalVideoTrack).on("track-ended", async () => {
          log("Screen share track ended (native event)");
          await stopScreenShare();
        });

        setIsScreenSharing(true);
      } else {
        await stopScreenShare();
      }
    } catch (err: unknown) {
      console.error("Screen share error:", err);
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(
        errorMessage.includes("PERMISSION_DENIED")
          ? "Screen sharing permission denied. Please allow permissions."
          : "Failed to share screen. Please allow screen-sharing permissions.",
      );
      setTimeout(clearError, 3000);
    }
  };

  const leaveCall = async () => {
    isLeavingRef.current = true;
    try {
      if (isScreenSharing) {
        await stopScreenShare();
      }
      await cleanupLocalTracks();
      await cleanupClient();
    } catch (err) {
      console.error("Error leaving call:", err);
    } finally {
      router.push("/meeting");
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(meetingLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  const toggleFullScreen = (uid: number | null) => {
    setFullScreenUser((prev) => (prev === uid ? null : uid));
  };

  const registerVideoRef = (uid: number, element: HTMLDivElement | null) => {
    if (element) {
      remoteVideoRefs.current.set(uid, element);
      // Play immediately when ref is registered
      const state = remoteUsers.get(uid);
      if (state && state.hasVideo && state.user.videoTrack) {
        const remoteVideo = state.user.videoTrack as IRemoteVideoTrack;

        // Determine fit mode: contain for screen share, cover for camera
        // We know from state if it's potentially a screen share.
        // Also check "isScreen" flag we set during subscribe/update
        const fitMode = state.isScreen ? "contain" : "cover";

        try {
          // Always try to play when ref is updated (re-mount)
          if (remoteVideo.isPlaying) {
            remoteVideo.stop();
          }
          remoteVideo.play(element, {
            fit: fitMode,
          });
          log(
            "Played remote video into newly registered element for",
            uid,
            "fit:",
            fitMode,
          );
        } catch (err) {
          console.warn("Error playing remote video after registering ref", err);
        }
      }
    } else {
      remoteVideoRefs.current.delete(uid);
    }
  };

  // floating preview drag handlers
  const clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max);

  const onFloatStart = (clientX: number, clientY: number) => {
    if (!floatRef.current) return;
    const rect = floatRef.current.getBoundingClientRect();
    dragStateRef.current = {
      dragging: true,
      startX: clientX - rect.left,
      startY: clientY - rect.top,
    };
  };

  const onFloatMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    onFloatStart(e.clientX, e.clientY);
  };

  const onFloatTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    // Prevent default to avoid immediate scroll/zoom during tap-drag init
    // e.preventDefault();
    const touch = e.touches[0];
    onFloatStart(touch.clientX, touch.clientY);
  };

  useEffect(() => {
    const getBounds = () => {
      if (!floatRef.current) return { maxX: 0, maxY: 0 };
      const rect = floatRef.current.getBoundingClientRect();
      const winWidth = window.innerWidth;
      const winHeight = window.innerHeight;
      return {
        maxX: winWidth - rect.width - 16,
        maxY: winHeight - rect.height - 16,
      };
    };

    const updatePosition = (x: number, y: number) => {
      if (!floatRef.current) return;

      const { maxX, maxY } = getBounds();
      const minX = 16;
      const minY = 16;

      const clampedX = clamp(x, minX, maxX);
      const clampedY = clamp(y, minY, maxY);

      floatPos.current.x = clampedX;
      floatPos.current.y = clampedY;

      floatRef.current.style.transform = `translate(${clampedX}px, ${clampedY}px)`;
    };

    const handleMove = (clientX: number, clientY: number) => {
      if (
        !dragStateRef.current ||
        !dragStateRef.current.dragging ||
        !floatRef.current
      )
        return;

      const x = clientX - dragStateRef.current.startX;
      const y = clientY - dragStateRef.current.startY;

      updatePosition(x, y);
    };

    const handleMouseMove = (e: globalThis.MouseEvent) => {
      handleMove(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: globalThis.TouchEvent) => {
      if (dragStateRef.current && dragStateRef.current.dragging) {
        e.preventDefault(); // Prevent scrolling while dragging
        const touch = e.touches[0];
        handleMove(touch.clientX, touch.clientY);
      }
    };

    const handleEnd = () => {
      if (dragStateRef.current) dragStateRef.current.dragging = false;
    };

    const handleResize = () => {
      if (floatRef.current) {
        // Re-clamp current position on resize
        updatePosition(floatPos.current.x, floatPos.current.y);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleEnd);
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleEnd);
    window.addEventListener("resize", handleResize);

    // Initial clamp check in case window size is weird on mount
    setTimeout(() => {
      updatePosition(floatPos.current.x, floatPos.current.y);
    }, 100);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleEnd);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Check if there's any screen share from remote users
  // const hasRemoteScreenShare = Array.from(remoteUsers.values()).some(
  //   (user) => user.isScreen,
  // );

  if (isLoading) return <PageLoading />;
  if (isError) return <div>something went wrong</div>;

  // --- Render functions ---
  const renderFullScreenView = () => {
    const fullScreenUserState = Array.from(remoteUsers.values()).find(
      (user) => user.uid === fullScreenUser,
    );

    return (
      <div className="absolute inset-0 bg-black z-10">
        <div className="w-full h-full relative">
          {fullScreenUserState && fullScreenUserState.hasVideo ? (
            <div
              ref={fullScreenVideoRef}
              className={`w-full h-full ${fullScreenUserState.isScreen
                  ? "object-contain bg-black"
                  : "object-cover bg-black"
                }`}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <div className="w-24 h-24 md:w-48 md:h-48 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mb-8">
                <VideoOff className="w-12 h-12 md:w-24 md:h-24 text-slate-500" />
              </div>
              <p className="text-xl md:text-3xl font-black text-white uppercase tracking-tighter">
                Participant {fullScreenUser}
              </p>
            </div>
          )}

          {/* Collapse Button Only */}
          <div className="absolute top-4 right-4 z-20">
            <button
              onClick={() => toggleFullScreen(null)}
              className="p-3 bg-black/50 hover:bg-black/70 border border-white/20 text-white rounded-full backdrop-blur-sm transition-all hover:scale-110 active:scale-95"
              title="Exit Fullscreen"
            >
              <Minimize2 className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderGridView = () => {
    if (remoteUsers.size === 0) {
      return (
        <div className="flex-1 flex items-center justify-center p-4 bg-white">
          <div className="text-center group">
            <div className="w-20 h-20 md:w-32 md:h-32 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-100 transition-transform group-hover:scale-110 duration-500">
              <Users className="w-8 h-8 md:w-16 md:h-16 text-slate-300" />
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-2 uppercase tracking-tighter">
              Waiting for Joiners
            </h3>
            <p className="text-slate-500 text-xs md:text-sm max-w-[280px] mx-auto leading-relaxed font-bold opacity-70">
              Invite participants to start your collaboration session.
            </p>
          </div>
        </div>
      );
    }

    const userCount = remoteUsers.size;

    return (
      <div className="flex-1 w-full h-full p-2 md:p-4 lg:p-6 flex items-center justify-center overflow-hidden bg-white">
        <div
          className={`grid gap-4 md:gap-5 w-full h-full max-h-full ${userCount === 1
              ? "grid-cols-1"
              : userCount === 2
                ? "grid-cols-1 md:grid-cols-2"
                : userCount <= 4
                  ? "grid-cols-1 sm:grid-cols-2 max-w-full"
                  : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
            }`}
        >
          {Array.from(remoteUsers.values()).map((s) => (
            <div
              key={s.uid}
              className="group relative bg-slate-50 rounded-2xl md:rounded-[2.5rem] overflow-hidden border border-slate-100 transition-all hover:border-blue-200 flex items-center justify-center shadow-none"
            >
              <div
                ref={(el) => registerVideoRef(s.uid, el)}
                className={`w-full h-full bg-slate-900 ${s.isScreen ? "object-contain" : "object-cover"
                  } transition-all duration-500`}
              />

              {!s.hasVideo && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50">
                  <div className="w-16 h-16 md:w-28 md:h-28 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                    <span className="text-slate-400 font-black text-xl md:text-5xl tracking-tighter opacity-80">
                      {String(s.uid).slice(-2).toUpperCase()}
                    </span>
                  </div>
                  <p className="mt-4 text-slate-400 text-[10px] md:text-xs font-black uppercase tracking-[0.3em] opacity-60">
                    Connected
                  </p>
                </div>
              )}

              {/* Top Controls Overlay - Enhanced Glassy */}
              <div className="absolute top-2 right-2 md:top-5 md:right-5 flex items-center gap-1.5 md:gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all">
                {!s.hasAudio && (
                  <div
                    className="p-1.5 md:p-2.5 bg-red-500/90 text-white border border-red-400/30 rounded-full shadow-lg backdrop-blur-md"
                    title="User is muted"
                  >
                    <MicOff className="w-3 h-3 md:w-4 md:h-4" />
                  </div>
                )}
                <button
                  onClick={() => toggleFullScreen(s.uid)}
                  className="p-1.5 md:p-3 bg-white/40 backdrop-blur-xl border border-white/30 text-slate-900 rounded-full shadow-sm transition-all hover:scale-110 hover:bg-white/60 active:scale-95"
                  title="Spotlight"
                >
                  <Maximize2 className="w-3 h-3 md:w-4 md:h-4" />
                </button>
              </div>

              {/* Bottom Info Overlay - Professional Glassy */}
              <div className="absolute bottom-2 left-2 md:bottom-6 md:left-6">
                <div className="px-2 md:px-5 py-1 md:py-2 bg-white/40 backdrop-blur-xl rounded-xl md:rounded-2xl border border-white/30 flex items-center gap-1.5 md:gap-3 shadow-sm">
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-600 rounded-full opacity-80" />
                  <span className="text-[9px] md:text-xs font-black text-slate-900 tracking-wider uppercase">
                    USER {s.uid}
                  </span>
                  {s.isScreen && (
                    <div className="flex items-center gap-1 md:gap-1.5 px-1.5 md:px-2 py-0.5 bg-blue-600/90 text-white rounded-lg transition-transform hover:scale-105 backdrop-blur-sm">
                      <MonitorUp className="w-2.5 h-2.5 md:w-4 md:h-4" />
                      <span className="text-[7px] md:text-[9px] font-black uppercase tracking-widest leading-none">
                        LIVE
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const getMainContent = () => {
    if (fullScreenUser !== null) {
      return renderFullScreenView();
    }

    return (
      <div className="flex-1 flex flex-col items-center justify-center overflow-auto h-full w-full">
        {renderGridView()}
      </div>
    );
  };

  const renderShareModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[2px] animate-in fade-in duration-300">
      <div className="bg-white/90 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl p-8 max-w-sm w-full border border-white/50 animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 scale-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner ring-1 ring-blue-100">
            <Share2 className="w-8 h-8 text-blue-600" />
          </div>
          <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-2">
            Invite Others
          </h4>
          <p className="text-slate-500 text-xs font-bold leading-relaxed px-4">
            Share the link below to bring collaborators into this professional
            workspace.
          </p>
        </div>

        <div className="relative group mb-8">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
          </div>
          <input
            readOnly
            value={meetingLink}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-9 pr-4 py-4 text-xs font-mono text-blue-700 font-bold select-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer hover:bg-white"
            onClick={(e) => (e.target as HTMLInputElement).select()}
          />
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={copyLink}
            className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-black text-xs uppercase tracking-[0.2em] transition-all active:scale-[0.98] ${copied
                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                : "bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700"
              }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" /> Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" /> Copy Link
              </>
            )}
          </button>
          <button
            onClick={() => setShowShareModal(false)}
            className="w-full py-4 rounded-2xl bg-white text-slate-500 font-black text-[10px] uppercase tracking-widest border border-slate-200 hover:bg-slate-50 transition-all"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );

  // --- UI: Pre-join view ---
  if (!isJoined) {
    return (
      <div className="flex min-h-screen bg-white text-slate-800 items-center justify-center p-2 md:p-4 overflow-y-auto">
        <div className="w-full max-w-4xl bg-white rounded-2xl md:rounded-3xl overflow-hidden border border-slate-100 shadow-sm my-auto">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left: Video Preview */}
            <div className="p-6 md:p-8 bg-slate-50/10">
              <div className="aspect-video bg-slate-100 rounded-2xl overflow-hidden flex items-center justify-center relative border border-slate-200 group">
                <div
                  ref={prejoinLocalRef}
                  className="w-full h-full scale-x-[-1]"
                />
                {!isVideoOn && !isBeforeStart && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-3 border border-slate-200">
                      <VideoOff className="w-10 h-10 text-slate-400" />
                    </div>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
                      Camera Off
                    </p>
                  </div>
                )}
                {isBeforeStart && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-transparent backdrop-blur-sm transition-all duration-500">
                    <div className="flex flex-col items-center gap-4 md:gap-6 animate-fade-in px-4">
                      <div className="relative">
                        <div className="w-16 h-16 md:w-24 md:h-24 rounded-full border-2 border-black flex items-center justify-center">
                          <Clock className="w-7 h-7 md:w-10 md:h-10 text-black animate-pulse" />
                        </div>
                        <div className="absolute inset-0 rounded-full border-t-2 border-blue-500 animate-spin" />
                      </div>
                      <div className="text-center">
                        <p className="text-black text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] mb-2">
                          Meeting Starts In
                        </p>
                        <p className="text-black text-2xl md:text-4xl font-mono font-black tracking-tighter">
                          {formatCountdown(waitingTime)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {/* Overlay controls - Minimalist */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  {/* <button
                    onClick={toggleMic}
                    className={`p-2.5 rounded-full backdrop-blur-3xl border shadow-sm ${isMicOn ? "bg-white/80 border-slate-200 text-slate-900" : "bg-red-500 text-white border-red-500"}`}
                  >
                    {isMicOn ? (
                      <Mic className="w-4 h-4" />
                    ) : (
                      <MicOff className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={toggleVideo}
                    className={`p-2.5 rounded-full backdrop-blur-3xl border shadow-sm ${isVideoOn ? "bg-white/80 border-slate-200 text-slate-900" : "bg-red-500 text-white border-red-500"}`}
                  >
                    {isVideoOn ? (
                      <Video className="w-4 h-4" />
                    ) : (
                      <VideoOff className="w-4 h-4" />
                    )}
                  </button> */}
                </div>
              </div>

              <div className="mt-8 flex items-center justify-center gap-6">
                <button
                  onClick={toggleMic}
                  className={`p-5 rounded-full transition-all border ${isMicOn ? "bg-white hover:bg-slate-50 text-slate-900 border-slate-200 shadow-sm" : "bg-red-500 text-white border-red-500 shadow-lg shadow-red-500/20"}`}
                >
                  {isMicOn ? (
                    <Mic className="w-6 h-6" />
                  ) : (
                    <MicOff className="w-6 h-6" />
                  )}
                </button>
                <button
                  onClick={toggleVideo}
                  className={`p-5 rounded-full transition-all border ${isVideoOn ? "bg-white hover:bg-slate-50 text-slate-900 border-slate-200 shadow-sm" : "bg-red-500 text-white border-red-500 shadow-lg shadow-red-500/20"}`}
                >
                  {isVideoOn ? (
                    <Video className="w-6 h-6" />
                  ) : (
                    <VideoOff className="w-6 h-6" />
                  )}
                </button>
              </div>
            </div>

            {/* Right: Info & Join */}
            <div className="p-8 md:p-10 flex flex-col justify-center bg-white">
              <h1 className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-tighter">
                Ready?
              </h1>
              <p className="text-slate-500 text-xs mb-8 font-bold leading-relaxed">
                Step into the professional workspace. ID:{" "}
                <span
                  className="text-blue-700 font-mono select-all ml-1 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(channelName);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                >
                  {channelName}
                </span>
              </p>

              {error && (
                <div className="mb-6 p-4 rounded-xl border border-red-200 bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-3 animate-shake">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-4">
                <button
                  onClick={joinMeeting}
                  disabled={isJoining || isGenerating || isBeforeStart}
                  className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 font-black text-xs uppercase tracking-[0.2em] transition-all active:scale-[0.98] shadow-lg shadow-blue-600/10"
                >
                  {isJoining || isGenerating ? (
                    <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                  ) : isBeforeStart ? (
                    "Waiting to Start..."
                  ) : (
                    "Join Session"
                  )}
                </button>
                <button
                  onClick={() => router.push("/meeting")}
                  className="w-full py-3 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-500 font-black text-[10px] uppercase tracking-widest border border-slate-200 transition-all"
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
        {showShareModal && renderShareModal()}
      </div>
    );
  }

  // --- Meeting UI when joined ---
  return (
    <div className="fixed inset-0 bg-white flex flex-col overflow-hidden text-slate-900 selection:bg-blue-500/10">
      {showShareModal && renderShareModal()}

      {/* Header: Enhanced Glassy Responsive Bar */}
      <div
        className={`absolute top-0 left-0 right-0 z-30 p-2 md:p-6 pointer-events-none flex justify-center transition-all duration-700 ease-in-out ${showControls && fullScreenUser === null
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0"
          }`}
      >
        <div className="max-w-[98vw] w-fit pointer-events-auto flex items-center gap-1.5 md:gap-4 px-2.5 md:px-5 py-1.5 md:py-2.5 bg-white/40 backdrop-blur-2xl border border-white/30 rounded-full shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] transition-all duration-500 hover:bg-white/60">
          {/* Badge Section */}
          <div className="flex items-center gap-1.5 px-2 md:px-2.5 py-0.5 md:py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full shrink-0">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
            <span className="hidden md:inline text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none">
              LIVE
            </span>
          </div>

          <div className="w-px h-3 md:h-4 bg-slate-300/40 shrink-0" />

          {/* User Count */}
          <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
            <Users className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-600" />
            <span className="text-[11px] md:text-sm font-black text-slate-900">
              {remoteUsers.size + 1}
            </span>
          </div>

          <div className="w-px h-3 md:h-4 bg-slate-300/40 shrink-0" />

          {/* Timer: Integrated into main bar */}
          <MeetingTimer startTime={startTime || undefined} onEnd={leaveCall} />

          <div className="w-px h-3 md:h-4 bg-slate-300/40 shrink-0" />

          {/* Channel ID: Truncated on mobile */}
          <div
            className="flex items-center gap-2 font-mono text-[9px] md:text-xs text-blue-600 font-black select-all cursor-pointer bg-blue-50/30 hover:bg-blue-100/50 px-1.5 md:px-2 py-0.5 md:py-1 rounded-lg transition-all border border-blue-100/20 max-w-[60px] xs:max-w-[80px] md:max-w-none overflow-hidden text-ellipsis whitespace-nowrap"
            onClick={() => setShowShareModal(true)}
            title={channelName}
          >
            {channelName}
          </div>

          {fullScreenUser && (
            <>
              <div className="w-px h-3 md:h-4 bg-slate-300/40 shrink-0 hidden md:block" />
              <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-full animate-fade-in shadow-lg shadow-blue-600/20">
                <Maximize2 className="w-3 h-3" />
                <span className="text-[9px] uppercase font-black tracking-widest">
                  SPOTLIGHT
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 relative bg-white">{getMainContent()}</div>

      {/* Floating Preview: Minimalist High-Contrast */}
      {fullScreenUser === null && (
        <div
          ref={floatRef}
          onMouseDown={onFloatMouseDown}
          onTouchStart={onFloatTouchStart}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            transform: `translate(${floatPos.current.x}px, ${floatPos.current.y}px)`,
            zIndex: 40,
          }}
          className={`w-36 h-24 md:w-64 md:h-40 bg-white border border-slate-200 rounded-xl md:rounded-2xl cursor-grab active:cursor-grabbing overflow-hidden group transition-all duration-700 ease-in-out hover:scale-[1.02] touch-none shadow-sm ${showControls
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95 pointer-events-none"
            }`}
        >
          <div className="w-full h-full relative">
            <div
              ref={floatingPreviewRef}
              className="w-full h-full bg-slate-100 scale-x-[-1]"
              style={{ pointerEvents: "none" }}
            />
            {!isVideoOn && !isScreenSharing && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-50">
                <div className="w-8 h-8 md:w-16 md:h-16 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200">
                  <VideoOff className="w-4 h-4 md:w-8 md:h-8 text-slate-400" />
                </div>
              </div>
            )}
            <div className="absolute bottom-2 left-2 flex items-center gap-1.5 px-2 py-0.5 md:py-1 bg-white/90 backdrop-blur-md rounded-lg border border-slate-200 shadow-sm">
              <span className="text-[9px] md:text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">
                YOU
              </span>
              {isScreenSharing && (
                <MonitorUp className="w-2.5 h-2.5 text-blue-700" />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Control Bar: Flatter minimalist dock (No heavy shadow) */}
      <div
        className={`fixed bottom-6 left-0 right-0 z-30 px-4 flex justify-center pointer-events-none transition-all duration-700 ease-in-out ${showControls
            ? "translate-y-0 opacity-100"
            : "translate-y-[200%] opacity-0"
          }`}
      >
        <div className="bg-white/80 backdrop-blur-3xl px-4 md:px-6 py-3.5 rounded-[2rem] border border-slate-200 flex items-center gap-3 md:gap-5 pointer-events-auto transition-transform hover:scale-[1.01] shadow-sm">
          <button
            onClick={toggleMic}
            className={`p-3 md:p-4 rounded-full transition-all ring-offset-2 ${isMicOn
                ? "bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-200"
                : "bg-red-500 text-white shadow-lg shadow-red-500/10 active:scale-95"
              }`}
          >
            {isMicOn ? (
              <Mic className="w-5 h-5 md:w-5 md:h-5" />
            ) : (
              <MicOff className="w-5 h-5 md:w-5 md:h-5" />
            )}
          </button>

          <button
            onClick={toggleVideo}
            className={`p-3 md:p-4 rounded-full transition-all ring-offset-2 ${isVideoOn
                ? "bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-200"
                : "bg-red-500 text-white shadow-lg shadow-red-500/10 active:scale-95"
              }`}
          >
            {isVideoOn ? (
              <Video className="w-5 h-5 md:w-5 md:h-5" />
            ) : (
              <VideoOff className="w-5 h-5 md:w-5 md:h-5" />
            )}
          </button>

          <button
            onClick={toggleScreenShare}
            className={`p-3 md:p-4 rounded-full transition-all ring-offset-2 ${isScreenSharing
                ? "bg-blue-600 text-white ring-2 ring-blue-600/10"
                : "bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-200"
              }`}
          >
            <MonitorUp className={`w-5 h-5 md:w-5 md:h-5`} />
          </button>

          <div className="h-8 w-px bg-slate-200 mx-1" />

          <button
            onClick={leaveCall}
            className="p-3 md:p-4 rounded-full bg-red-500 text-white shadow-xl shadow-red-500/10 transition-all hover:rotate-12 active:scale-90"
          >
            <PhoneOff className="w-5 h-5 md:w-5 md:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
