import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { ProductForm } from "@/components/admin/product-form"

export default async function NewProductPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== "admin") {
    redirect("/signin")
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-4xl font-bold">New Product</h1>
        <p className="text-neutral-600 mt-2">
          Add a new product to your shop
        </p>
      </div>

      <ProductForm />
    </div>
  )
}

