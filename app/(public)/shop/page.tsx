import { getProducts } from "@/lib/db/queries"
import { ProductCard } from "@/components/shop/product-card"
import { ShopFilters } from "@/components/shop/shop-filters"
import Image from "next/image"

export const dynamic = "force-dynamic"

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const params = await searchParams
  const allProducts = await getProducts()

  // Filter products based on category
  const products = params.category 
    ? allProducts.filter(product => product.category === params.category)
    : allProducts

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[50vh] overflow-hidden">
        <Image
          src="/shop/header.jpg"
          alt="Shop"
          fill
          className="object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-white/80 mb-2 text-sm font-bold uppercase tracking-wider">
              SHOP
            </div>
            <h1 className="text-4xl md:text-6xl font-crimson font-normal tracking-tighter text-white mb-4">
              Express Yourself
            </h1>
            <p className="text-xl text-white/90 max-w-2xl">
              Unique pieces that celebrate creativity and self-expression
            </p>
          </div>
        </div>
      </section>

      {/* Filters & Products */}
      <section className="relative z-0 pb-32 px-6 pt-16 bg-white">
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
              <h2 className="text-2xl font-crimson font-normal tracking-tighter mb-2">No products yet</h2>
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
                  price={product.price}
                  compareAtPrice={product.compareAtPrice || undefined}
                  images={product.images || []}
                  status={product.status}
                  stock={product.stock}
                  category={product.category}
                  tags={product.tags || []}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
