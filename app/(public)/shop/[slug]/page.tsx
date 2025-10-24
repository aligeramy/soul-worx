import { getProductBySlug } from "@/lib/db/queries"
import { notFound } from "next/navigation"
import { ProductDetails } from "@/components/shop/product-details"

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  return <ProductDetails product={{
    ...product,
    tags: product.tags || [],
    specifications: product.specifications || {},
    variants: product.variants || [],
    category: product.category
  }} />
}

