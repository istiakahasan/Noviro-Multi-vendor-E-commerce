import { EditProductForm } from "@/components/dashboardLayout/EditproductForm";


const EditProductPage = ({ params }: { params: { productId: string } }) => {
    console.log("productId:", params.productId);
    return (
        <div>
            <EditProductForm productId={params.productId} />
        </div>
    );
};

export default EditProductPage;