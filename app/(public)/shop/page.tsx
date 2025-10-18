import { getProducts } from "@/lib/db/queries"
import { ProductCard } from "@/components/shop/product-card"
import { ShopFilters } from "@/components/shop/shop-filters"

export const dynamic = "force-dynamic"

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const params = await searchParams
  const products = await getProducts()

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50">
      {/* Modern Header */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="inline-block mb-6">
            <span className="px-4 py-2 bg-black text-white text-sm font-bold rounded-full">
              SHOP
            </span>
          </div>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-6">
            Express
            <br />
            <span className="bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
              Yourself
            </span>
          </h1>
          <p className="text-xl text-neutral-600 max-w-2xl font-light">
            Unique pieces that celebrate creativity and self-expression
          </p>
        </div>
      </section>

      {/* Filters & Products */}
      <section className="pb-32 px-6">
        <div className="max-w-7xl mx-auto">
          <ShopFilters currentCategory={params.category} />
          
          {products.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-12 w-12 text-neutral-400"
                >
                  <circle cx="8" cy="21" r="1" />
                  <circle cx="19" cy="21" r="1" />
                  <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2">No products yet</h2>
              <p className="text-neutral-600">
                Check back soon for exciting new items
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  slug={product.slug}
                  name={product.name}
                  description={product.description}
                  price={product.price}
                  compareAtPrice={product.compareAtPrice || undefined}
                  images={product.images || []}
                  status={product.status}
                  stock={product.stock}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
