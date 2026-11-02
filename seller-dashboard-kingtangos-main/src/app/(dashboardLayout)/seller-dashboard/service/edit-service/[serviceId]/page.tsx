import { EditServiceForm } from "@/components/dashboardLayout/EditServiceForm";




const EditServicePage = ({ params }: { params: { serviceId: string } }) => {
    console.log("serviceId:", params.serviceId);
    return (
        <div>
            <EditServiceForm serviceId={params.serviceId} />
        </div>
    );
};

export default EditServicePage;