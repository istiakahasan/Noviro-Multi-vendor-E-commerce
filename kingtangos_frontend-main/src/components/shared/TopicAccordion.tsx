import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"


export default function TopicAccordion() {
    const items = [
        {
            id: "1",
            title: "Coupon Guide",
            content:
                "Lorem ipsum dolor sit amet consectetur. Potenti nascetur convallis donec ac gravida odio maecenas ullamcorper. Eget purus morbi morbi lacus. Aliquam lectus nunc turpis tincidunt porta massa pellentesque. Tellus fermentum odio sit in ullamcorper in vulputate est elit. Enim eget nulla nunc sit suspendisse. Nunc dignissim ut hendrerit non scelerisque tristique cras. Pharetra augue enim neque leo lacinia ac arcu auctor ac. Id morbi dignissim dictum facilisi enim rhoncus cursus vulputate vitae. Nibh bibendum ut sit quis.",
        },
        {
            id: "2",
            title: "How to Apply for a Trade Account?",
            content:
                "Lorem ipsum dolor sit amet consectetur. Potenti nascetur convallis donec ac gravida odio maecenas ullamcorper. Eget purus morbi morbi lacus. Aliquam lectus nunc turpis tincidunt porta massa pellentesque. Tellus fermentum odio sit in ullamcorper in vulputate est elit. Enim eget nulla nunc sit suspendisse. Nunc dignissim ut hendrerit non scelerisque tristique cras. Pharetra augue enim neque leo lacinia ac arcu auctor ac. Id morbi dignissim dictum facilisi enim rhoncus cursus vulputate vitae. Nibh bibendum ut sit quis.",
        },
        {
            id: "3",
            title: "Introduction to the Trade Program",
            content:
                "Lorem ipsum dolor sit amet consectetur. Potenti nascetur convallis donec ac gravida odio maecenas ullamcorper. Eget purus morbi morbi lacus. Aliquam lectus nunc turpis tincidunt porta massa pellentesque. Tellus fermentum odio sit in ullamcorper in vulputate est elit. Enim eget nulla nunc sit suspendisse. Nunc dignissim ut hendrerit non scelerisque tristique cras. Pharetra augue enim neque leo lacinia ac arcu auctor ac. Id morbi dignissim dictum facilisi enim rhoncus cursus vulputate vitae. Nibh bibendum ut sit quis.",
        },
        {
            id: "4",
            title: "Shipping Large Item(s)",
            content:
                "Lorem ipsum dolor sit amet consectetur. Potenti nascetur convallis donec ac gravida odio maecenas ullamcorper. Eget purus morbi morbi lacus. Aliquam lectus nunc turpis tincidunt porta massa pellentesque. Tellus fermentum odio sit in ullamcorper in vulputate est elit. Enim eget nulla nunc sit suspendisse. Nunc dignissim ut hendrerit non scelerisque tristique cras. Pharetra augue enim neque leo lacinia ac arcu auctor ac. Id morbi dignissim dictum facilisi enim rhoncus cursus vulputate vitae. Nibh bibendum ut sit quis.",
        },
        {
            id: "5",
            title: "Shipping FAQs",
            content:
                "Lorem ipsum dolor sit amet consectetur. Potenti nascetur convallis donec ac gravida odio maecenas ullamcorper. Eget purus morbi morbi lacus. Aliquam lectus nunc turpis tincidunt porta massa pellentesque. Tellus fermentum odio sit in ullamcorper in vulputate est elit. Enim eget nulla nunc sit suspendisse. Nunc dignissim ut hendrerit non scelerisque tristique cras. Pharetra augue enim neque leo lacinia ac arcu auctor ac. Id morbi dignissim dictum facilisi enim rhoncus cursus vulputate vitae. Nibh bibendum ut sit quis.",
        },
        {
            id: "6",
            title: "30 Day Return Policy",
            content:
                "Lorem ipsum dolor sit amet consectetur. Potenti nascetur convallis donec ac gravida odio maecenas ullamcorper. Eget purus morbi morbi lacus. Aliquam lectus nunc turpis tincidunt porta massa pellentesque. Tellus fermentum odio sit in ullamcorper in vulputate est elit. Enim eget nulla nunc sit suspendisse. Nunc dignissim ut hendrerit non scelerisque tristique cras. Pharetra augue enim neque leo lacinia ac arcu auctor ac. Id morbi dignissim dictum facilisi enim rhoncus cursus vulputate vitae. Nibh bibendum ut sit quis.",
        },
        {
            id: "7",
            title: "Forgot Your Password",
            content:
                "Lorem ipsum dolor sit amet consectetur. Potenti nascetur convallis donec ac gravida odio maecenas ullamcorper. Eget purus morbi morbi lacus. Aliquam lectus nunc turpis tincidunt porta massa pellentesque. Tellus fermentum odio sit in ullamcorper in vulputate est elit. Enim eget nulla nunc sit suspendisse. Nunc dignissim ut hendrerit non scelerisque tristique cras. Pharetra augue enim neque leo lacinia ac arcu auctor ac. Id morbi dignissim dictum facilisi enim rhoncus cursus vulputate vitae. Nibh bibendum ut sit quis.",
        },
        {
            id: "8",
            title: "Order Status Terms",
            content:
                "Lorem ipsum dolor sit amet consectetur. Potenti nascetur convallis donec ac gravida odio maecenas ullamcorper. Eget purus morbi morbi lacus. Aliquam lectus nunc turpis tincidunt porta massa pellentesque. Tellus fermentum odio sit in ullamcorper in vulputate est elit. Enim eget nulla nunc sit suspendisse. Nunc dignissim ut hendrerit non scelerisque tristique cras. Pharetra augue enim neque leo lacinia ac arcu auctor ac. Id morbi dignissim dictum facilisi enim rhoncus cursus vulputate vitae. Nibh bibendum ut sit quis.",
        },
        {
            id: "9",
            title: "How to Write a Review?",
            content:
                "Lorem ipsum dolor sit amet consectetur. Potenti nascetur convallis donec ac gravida odio maecenas ullamcorper. Eget purus morbi morbi lacus. Aliquam lectus nunc turpis tincidunt porta massa pellentesque. Tellus fermentum odio sit in ullamcorper in vulputate est elit. Enim eget nulla nunc sit suspendisse. Nunc dignissim ut hendrerit non scelerisque tristique cras. Pharetra augue enim neque leo lacinia ac arcu auctor ac. Id morbi dignissim dictum facilisi enim rhoncus cursus vulputate vitae. Nibh bibendum ut sit quis.",
        },
        {
            id: "10",
            title: "How Do I Change or Cancel My Order?",
            content:
                "Lorem ipsum dolor sit amet consectetur. Potenti nascetur convallis donec ac gravida odio maecenas ullamcorper. Eget purus morbi morbi lacus. Aliquam lectus nunc turpis tincidunt porta massa pellentesque. Tellus fermentum odio sit in ullamcorper in vulputate est elit. Enim eget nulla nunc sit suspendisse. Nunc dignissim ut hendrerit non scelerisque tristique cras. Pharetra augue enim neque leo lacinia ac arcu auctor ac. Id morbi dignissim dictum facilisi enim rhoncus cursus vulputate vitae. Nibh bibendum ut sit quis.",
        },
    ]

    return (
            <div>
                <Accordion type="single" collapsible className="w-full" defaultValue="1">
                    {items.map((item) => (
                        <AccordionItem value={item.id} key={item.id} className="py-1">
                            <AccordionTrigger className="py-2 text-primary md:text-base text-sm font-normal leading-6 hover:no-underline">
                                {item.title}
                            </AccordionTrigger>
                            <AccordionContent className="pb-2 text-primary/60 md:text-sm text-xs">
                                {item.content}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        )
    }
