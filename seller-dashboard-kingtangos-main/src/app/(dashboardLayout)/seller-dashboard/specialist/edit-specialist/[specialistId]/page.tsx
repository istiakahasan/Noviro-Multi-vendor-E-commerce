import { EditSpecialistForm } from "@/components/dashboardLayout/EditSpecialistForm";




const EditSpecialistPage = ({ params }: { params: { specialistId: string } }) => {
    console.log("specialistId:", params.specialistId);
    return (
        <div>
            <EditSpecialistForm specialistId={params.specialistId} />
        </div>
    );
};

export default EditSpecialistPage;