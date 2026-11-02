import EditStoreAccountForm from "@/components/dashboardLayout/EditStoreForm";




const EditStorePage = ({ params }: { params: { storeId: string } }) => {
    console.log("storeId:", params.storeId);
    return (
        <div>
            <EditStoreAccountForm storeId={params.storeId} />
        </div>
    );
};

export default EditStorePage;