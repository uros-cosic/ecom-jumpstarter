import styles from "./product.module.css";

type Props = {
    details: string
}

const ProductDetails = ({ details }: Props) => {
    return (
        <div className={`${styles['product-details-content']} product-details-content max-w-4xl flex flex-col gap-5`} dangerouslySetInnerHTML={{ __html: details }} />
    )
}

export default ProductDetails
