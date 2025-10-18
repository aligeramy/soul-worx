import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getProductById } from "@/lib/db/queries"
import { ProductForm } from "@/components/admin/product-form"

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session?.user || session.user.role !== "admin") {
    redirect("/signin")
  }

  const { id } = await params
  const product = await getProductById(id)

  if (!product) {
    redirect("/dashboard/admin/shop")
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Edit Product</h1>
        <p className="text-neutral-600 mt-2">
          Update product details
        </p>
      </div>

      <ProductForm product={{
        ...product,
        tags: product.tags || [],
        specifications: product.specifications || {}
      }} />
    </div>
  )
}

