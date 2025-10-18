import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getAllProductsForAdmin } from "@/lib/db/queries"
import { ProductsTable } from "@/components/admin/products-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Plus, Package } from "lucide-react"

export default async function AdminShopPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== "admin") {
    redirect("/signin")
  }

  const products = await getAllProductsForAdmin()

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Shop</h1>
          <p className="text-white/60 mt-1">
            Manage your shop inventory and products
          </p>
        </div>
        <Link href="/dashboard/admin/shop/new">
          <Button className="bg-white text-black hover:bg-white/90 font-semibold">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-[#1c1c1e] border-white/10">
          <CardContent className="p-4">
            <div className="text-xs font-semibold text-white/60 mb-1 uppercase tracking-wider">Total Products</div>
            <div className="text-3xl font-bold text-white">{products.length}</div>
          </CardContent>
        </Card>
        <Card className="bg-[#1c1c1e] border-emerald-500/20">
          <CardContent className="p-4">
            <div className="text-xs font-semibold text-emerald-400 mb-1 uppercase tracking-wider">Active</div>
            <div className="text-3xl font-bold text-white">
              {products.filter((p) => p.status === "active").length}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#1c1c1e] border-amber-500/20">
          <CardContent className="p-4">
            <div className="text-xs font-semibold text-amber-400 mb-1 uppercase tracking-wider">Drafts</div>
            <div className="text-3xl font-bold text-white">
              {products.filter((p) => p.status === "draft").length}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#1c1c1e] border-red-500/20">
          <CardContent className="p-4">
            <div className="text-xs font-semibold text-red-400 mb-1 uppercase tracking-wider">Out of Stock</div>
            <div className="text-3xl font-bold text-white">
              {products.filter((p) => p.status === "sold_out" || p.stock === 0).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Products Table */}
      {products.length === 0 ? (
        <Card className="bg-[#1c1c1e] border-white/10">
          <CardContent className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 bg-white/5 rounded-full flex items-center justify-center">
              <Package className="h-8 w-8 text-white/40" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No products yet</h3>
            <p className="text-white/60 mb-6">Add your first product to get started</p>
            <Link href="/dashboard/admin/shop/new">
              <Button className="bg-white text-black hover:bg-white/90 font-semibold">
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <ProductsTable products={products} />
      )}
    </div>
  )
}
