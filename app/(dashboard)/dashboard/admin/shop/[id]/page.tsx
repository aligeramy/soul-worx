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
    <div className="bg-white rounded-lg p-8 shadow-sm [&_*]:text-neutral-900 [&_label]:text-neutral-900 [&_p]:text-neutral-600 [&_span]:text-neutral-600">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-neutral-900">Edit Product</h1>
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
    </div>
  )
}

