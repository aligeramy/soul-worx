import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { ProductForm } from "@/components/admin/product-form"

export default async function NewProductPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== "admin") {
    redirect("/signin")
  }

  return (
    <div className="bg-white rounded-lg p-8 shadow-sm [&_*]:text-neutral-900 [&_label]:text-neutral-900 [&_p]:text-neutral-600 [&_span]:text-neutral-600">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-neutral-900">New Product</h1>
          <p className="text-neutral-600 mt-2">
            Add a new product to your shop
          </p>
        </div>

        <ProductForm />
      </div>
    </div>
  )
}

