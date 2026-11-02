import { EditConsultationForm } from "@/components/dashboardLayout/EditConsultationForm";




const EditConsultationPage = ({ params }: { params: { consultationId: string } }) => {
    console.log("consultationId:", params.consultationId);
    return (
        <div>
            <EditConsultationForm consultationId={params.consultationId} />
        </div>
    );
};

export default EditConsultationPage;

