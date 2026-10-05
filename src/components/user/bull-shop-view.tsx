'use client';

import React, { useState } from 'react';
import { useEarnBull } from '@/context/earn-bull-context';
import { Search, ShoppingBag, Star, Plus, Minus, Trash2, ShieldCheck, ArrowRight, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet';
import type { ProductCategory, Product } from '@/lib/types';

export const BullShopView: React.FC = () => {
  const {
    products,
    selectedProductId,
    setSelectedProductId,
    addToCart,
    cart,
    removeFromCart,
    updateCartQuantity,
    isCartOpen,
    setIsCartOpen,
    checkout,
  } = useEarnBull();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [shippingAddress, setShippingAddress] = useState('14 Independence Avenue, Accra');

  const selectedProduct = products.find((p) => p.id === selectedProductId);

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'fashion', label: 'Fashion' },
    { id: 'electronics', label: 'Electronics' },
    { id: 'home', label: 'Home' },
    { id: 'beauty', label: 'Beauty' },
  ];

  const filteredProducts = products.filter((p) => {
    const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.partnerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.priceGhs * item.quantity, 0);
  const deliveryFee = cart.length > 0 ? 15.00 : 0.00;
  const cartTotal = cartSubtotal + deliveryFee;

  const handleCheckout = () => {
    const res = checkout(shippingAddress);
    if (res.success) {
      alert(res.message);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-headline font-extrabold text-2xl text-white flex items-center gap-2">
            Bull Shop
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              Partner Products
            </span>
          </h2>
          <p className="text-xs text-emerald-300/80">Shop verified partner products at exclusive member prices</p>
        </div>

        {/* Search Bar & Cart Trigger */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-emerald-400" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-[#0A2719] border-[#144930] text-white text-xs rounded-xl focus:border-emerald-500"
            />
          </div>

          <Button
            onClick={() => setIsCartOpen(true)}
            className="relative bg-[#0A2719] border border-[#144930] hover:bg-emerald-950 text-white font-bold text-xs px-3.5 h-9 rounded-xl flex items-center gap-2"
          >
            <ShoppingBag className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">My Cart</span>
            {cart.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-400 text-black text-[10px] font-extrabold flex items-center justify-center">
                {cart.reduce((sum, i) => sum + i.quantity, 0)}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeCategory === cat.id
                ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                : 'bg-[#0A2719] text-emerald-200 border border-[#144930] hover:border-emerald-500/40'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Member Exclusive Discount Banner */}
      <div className="bg-gradient-to-r from-emerald-900/60 via-[#0C3321] to-emerald-950/80 border border-emerald-500/40 rounded-2xl p-6 relative overflow-hidden shadow-xl flex items-center justify-between">
        <div className="space-y-1 max-w-md">
          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest block">Member Exclusive</span>
          <h3 className="font-headline font-extrabold text-xl sm:text-2xl text-white">
            Up to 30% Off on selected products
          </h3>
          <p className="text-xs text-emerald-200/90 pt-1">
            Enjoy direct discounts guaranteed by participating partner brands.
          </p>
        </div>
        <div className="hidden sm:flex items-center justify-center w-20 h-20 rounded-2xl bg-amber-400/20 border border-amber-400/40 text-amber-400 text-3xl font-extrabold shadow-lg shadow-amber-400/10">
          -30%
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredProducts.map((prod) => {
          const hasDiscount = prod.originalPriceGhs && prod.originalPriceGhs > prod.priceGhs;
          const discountPct = hasDiscount
            ? Math.round(((prod.originalPriceGhs! - prod.priceGhs) / prod.originalPriceGhs!) * 100)
            : 0;

          return (
            <div
              key={prod.id}
              className="bg-[#0A2719] border border-[#144930] hover:border-emerald-500/40 rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 hover:shadow-xl group"
            >
              <div>
                {/* Image */}
                <div
                  onClick={() => setSelectedProductId(prod.id)}
                  className="relative aspect-square rounded-xl overflow-hidden bg-[#061D12] mb-3 cursor-pointer group-hover:scale-[1.02] transition-transform"
                >
                  <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                  {hasDiscount && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-black shadow">
                      -{discountPct}%
                    </span>
                  )}
                  {prod.hasTask && (
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-black shadow">
                      Earn Task
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="space-y-1 mb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
                      {prod.partnerName}
                    </span>
                    <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                      <Star className="w-3 h-3 fill-current" />
                      <span>{prod.rating}</span>
                    </div>
                  </div>

                  <h3
                    onClick={() => setSelectedProductId(prod.id)}
                    className="font-headline font-bold text-base text-white truncate cursor-pointer hover:text-emerald-400 transition-colors"
                  >
                    {prod.name}
                  </h3>

                  {/* Pricing */}
                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="font-headline font-extrabold text-lg text-white">
                      GH₵{prod.priceGhs.toFixed(2)}
                    </span>
                    {hasDiscount && (
                      <span className="text-xs text-zinc-500 line-through">
                        GH₵{prod.originalPriceGhs!.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#144930]/80">
                <Button
                  size="sm"
                  onClick={() => addToCart(prod)}
                  className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs rounded-xl py-2"
                >
                  Add to Cart
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    addToCart(prod);
                    setIsCartOpen(true);
                  }}
                  className="border-[#144930] hover:bg-emerald-950 text-emerald-300 font-semibold text-xs rounded-xl py-2"
                >
                  Buy Now
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Product Detail Modal */}
      <Dialog open={!!selectedProductId} onOpenChange={() => setSelectedProductId(null)}>
        {selectedProduct && (
          <DialogContent className="max-w-2xl bg-[#061D12] border-[#144930] text-white p-6 sm:p-8">
            <DialogHeader className="sr-only">
              <DialogTitle>{selectedProduct.name}</DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Image */}
              <div className="aspect-square rounded-2xl overflow-hidden bg-[#0A2719] border border-[#144930]">
                <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
              </div>

              {/* Product Info */}
              <div className="flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                    {selectedProduct.partnerName}
                  </span>
                  <h2 className="font-headline font-bold text-2xl text-white mt-1">{selectedProduct.name}</h2>

                  <div className="flex items-center gap-3 my-2">
                    <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                      <Star className="w-4 h-4 fill-current" />
                      <span>{selectedProduct.rating} ({selectedProduct.reviewCount} reviews)</span>
                    </div>
                    <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                      In Stock ({selectedProduct.stock})
                    </span>
                  </div>

                  <p className="text-xs text-emerald-200/90 leading-relaxed my-3">
                    {selectedProduct.description}
                  </p>

                  <div className="flex items-baseline gap-3 my-4">
                    <span className="font-headline font-extrabold text-3xl text-white">
                      GH₵{selectedProduct.priceGhs.toFixed(2)}
                    </span>
                    {selectedProduct.originalPriceGhs && (
                      <span className="text-sm text-zinc-500 line-through">
                        GH₵{selectedProduct.originalPriceGhs.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="space-y-2 border-t border-[#144930] pt-3 text-[11px] text-emerald-300">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>100% Original Partner Guarantee</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Fast Delivery across Ghana</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Button
                    onClick={() => {
                      addToCart(selectedProduct);
                      setSelectedProductId(null);
                    }}
                    className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs py-3 rounded-xl"
                  >
                    Add to Cart
                  </Button>
                  <Button
                    onClick={() => {
                      addToCart(selectedProduct);
                      setSelectedProductId(null);
                      setIsCartOpen(true);
                    }}
                    className="bg-amber-400 hover:bg-amber-500 text-black font-bold text-xs py-3 rounded-xl"
                  >
                    Buy Now
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* Cart Drawer / Slide-Over */}
      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md bg-[#061D12] border-[#144930] text-white p-6 flex flex-col justify-between">
          <SheetHeader className="border-b border-[#144930] pb-4">
            <SheetTitle className="font-headline font-bold text-xl text-white flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-400" />
              My Cart ({cart.reduce((sum, i) => sum + i.quantity, 0)})
            </SheetTitle>
          </SheetHeader>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto py-4 space-y-4">
            {cart.length === 0 ? (
              <div className="py-12 text-center text-emerald-400/60 text-xs">
                Your cart is currently empty.
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.product.id} className="flex items-center justify-between gap-3 bg-[#0A2719] border border-[#144930] p-3 rounded-xl">
                  <img src={item.product.image} alt={item.product.name} className="w-14 h-14 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs text-white truncate">{item.product.name}</h4>
                    <span className="text-[10px] text-emerald-400">{item.product.partnerName}</span>
                    <div className="font-extrabold text-xs text-white mt-1">
                      GH₵{(item.product.priceGhs * item.quantity).toFixed(2)}
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-1.5 bg-[#061D12] border border-[#144930] rounded-lg p-1">
                    <button
                      onClick={() => updateCartQuantity(item.product.id, -1)}
                      className="p-1 hover:text-emerald-400 text-zinc-400"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-bold px-1">{item.quantity}</span>
                    <button
                      onClick={() => updateCartQuantity(item.product.id, 1)}
                      className="p-1 hover:text-emerald-400 text-zinc-400"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-zinc-500 hover:text-red-400 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Checkout Footer */}
          {cart.length > 0 && (
            <div className="border-t border-[#144930] pt-4 space-y-3">
              <div className="space-y-1.5 text-xs text-emerald-200">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-white">GH₵{cartSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="font-semibold text-white">GH₵{deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-[#144930]">
                  <span>Total</span>
                  <span className="text-emerald-400 font-headline text-lg">GH₵{cartTotal.toFixed(2)}</span>
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-sm py-3 rounded-xl shadow-lg shadow-emerald-500/20"
              >
                Checkout Now
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};
