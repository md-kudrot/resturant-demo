import './style.css'

// Types
interface CartItem {
  id: string
  title: string
  price: number
  quantity: number
  image: string
}

// Initial Cart items matching the screenshot
let cart: CartItem[] = [
  {
    id: '1',
    title: 'Margherita Pizza',
    price: 12.99,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: '2',
    title: 'Classic Burger',
    price: 8.99,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=500&q=80'
  }
]

let favoriteItems: Set<string> = new Set()
let activeCategoryFilter: string | null = null

document.addEventListener('DOMContentLoaded', () => {
  renderCart()
  updateFavCount()
  setupSearchListeners()
})

// Presentation View Switcher (Desktop Web vs Mobile Phone Frame)
;(window as any).setViewMode = (mode: 'desktop' | 'mobile') => {
  const viewport = document.getElementById('presentation-viewport')
  const phoneStatusBar = document.getElementById('phone-status-bar')
  const desktopBtn = document.getElementById('view-desktop-btn')
  const mobileBtn = document.getElementById('view-mobile-btn')
  const desktopSearch = document.getElementById('desktop-search-bar')
  const mobileSearch = document.getElementById('mobile-search-bar')
  const desktopNav = document.getElementById('desktop-nav')
  const mobileMenuBtn = document.getElementById('mobile-menu-btn')
  const mobileBottomNav = document.getElementById('mobile-bottom-nav')

  if (!viewport || !desktopBtn || !mobileBtn) return

  if (mode === 'mobile') {
    viewport.className = 'max-w-[412px] my-6 mx-auto rounded-[46px] border-[10px] border-[#22242a] shadow-[0_30px_90px_rgba(0,0,0,0.85)] overflow-hidden transition-all duration-300 relative'
    phoneStatusBar?.classList.remove('hidden')
    phoneStatusBar?.classList.add('flex')

    desktopBtn.className = 'px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold flex items-center gap-1.5 transition-all cursor-pointer'
    mobileBtn.className = 'px-3 py-1 rounded-full bg-[#f59e0b] text-black font-extrabold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer'

    if (desktopSearch) desktopSearch.classList.add('hidden')
    if (mobileSearch) {
      mobileSearch.classList.remove('hidden')
      mobileSearch.classList.add('flex')
    }

    if (desktopNav) desktopNav.classList.add('hidden')
    if (mobileMenuBtn) mobileMenuBtn.classList.remove('hidden')
    if (mobileBottomNav) {
      mobileBottomNav.classList.remove('hidden')
      mobileBottomNav.classList.add('fixed')
    }

    showToast('Switched to Mobile App Frame (Matches Image 1)', 'info')
  } else {
    viewport.className = 'w-full my-0 mx-auto transition-all duration-300'
    phoneStatusBar?.classList.add('hidden')
    phoneStatusBar?.classList.remove('flex')

    desktopBtn.className = 'px-3 py-1 rounded-full bg-[#f59e0b] text-black font-extrabold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer'
    mobileBtn.className = 'px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold flex items-center gap-1.5 transition-all cursor-pointer'

    if (desktopSearch) desktopSearch.classList.remove('hidden')
    if (mobileSearch) mobileSearch.classList.add('hidden')

    if (desktopNav) desktopNav.classList.remove('hidden')
    if (mobileBottomNav) mobileBottomNav.classList.add('hidden')

    showToast('Switched to Full Desktop View (Matches Image 2)', 'info')
  }
}

// Search Listeners
function setupSearchListeners() {
  const desktopInput = document.getElementById('food-search-desktop') as HTMLInputElement | null
  const mobileInput = document.getElementById('food-search-mobile') as HTMLInputElement | null

  if (desktopInput) {
    desktopInput.addEventListener('input', (e) => {
      const query = (e.target as HTMLInputElement).value.toLowerCase().trim()
      filterFoods(query, activeCategoryFilter)
    })
  }

  if (mobileInput) {
    mobileInput.addEventListener('input', (e) => {
      const query = (e.target as HTMLInputElement).value.toLowerCase().trim()
      filterFoods(query, activeCategoryFilter)
    })
  }
}

;(window as any).triggerSearch = (source: 'desktop' | 'mobile') => {
  const input = document.getElementById(source === 'desktop' ? 'food-search-desktop' : 'food-search-mobile') as HTMLInputElement | null
  const query = input ? input.value.toLowerCase().trim() : ''
  filterFoods(query, activeCategoryFilter)
  const popularSection = document.getElementById('popular-foods')
  if (popularSection) popularSection.scrollIntoView({ behavior: 'smooth' })
}

// Filter Foods by query and category
function filterFoods(query: string, category: string | null) {
  const cards = document.querySelectorAll<HTMLElement>('.food-card')
  const noFoods = document.getElementById('no-foods-found')
  let count = 0

  cards.forEach((card) => {
    const title = card.getAttribute('data-title')?.toLowerCase() || ''
    const cat = card.getAttribute('data-category')?.toLowerCase() || ''

    const matchesQuery = !query || title.includes(query) || cat.includes(query)
    const matchesCategory = !category || cat === category.toLowerCase()

    if (matchesQuery && matchesCategory) {
      card.style.display = 'flex'
      count++
    } else {
      card.style.display = 'none'
    }
  })

  if (noFoods) {
    noFoods.style.display = count === 0 ? 'block' : 'none'
  }
}

// Filter Category
;(window as any).filterCategory = (categoryName: string) => {
  activeCategoryFilter = categoryName

  document.querySelectorAll('.category-pill').forEach((pill) => {
    const cat = pill.getAttribute('data-cat')
    const imgWrapper = pill.querySelector('div')
    if (cat === categoryName) {
      imgWrapper?.classList.add('border-amber-400', 'ring-2', 'ring-amber-400', 'scale-105')
    } else {
      imgWrapper?.classList.remove('border-amber-400', 'ring-2', 'ring-amber-400', 'scale-105')
    }
  })

  const filterStatus = document.getElementById('filter-status')
  const currentFilterName = document.getElementById('current-filter-name')
  if (filterStatus && currentFilterName) {
    filterStatus.classList.remove('hidden')
    filterStatus.classList.add('flex')
    currentFilterName.textContent = categoryName
  }

  filterFoods('', categoryName)

  const popularSection = document.getElementById('popular-foods')
  if (popularSection) popularSection.scrollIntoView({ behavior: 'smooth' })
}

// Reset Category Filter
;(window as any).resetCategoryFilter = () => {
  activeCategoryFilter = null
  const filterStatus = document.getElementById('filter-status')
  if (filterStatus) {
    filterStatus.classList.remove('flex')
    filterStatus.classList.add('hidden')
  }

  document.querySelectorAll('.category-pill div').forEach((div) => {
    div.classList.remove('border-amber-400', 'ring-2', 'ring-amber-400', 'scale-105')
  })

  filterFoods('', null)
}

// Reset Search
;(window as any).resetSearch = () => {
  const desktopInput = document.getElementById('food-search-desktop') as HTMLInputElement | null
  const mobileInput = document.getElementById('food-search-mobile') as HTMLInputElement | null
  if (desktopInput) desktopInput.value = ''
  if (mobileInput) mobileInput.value = ''
  ;(window as any).resetCategoryFilter()
}

// Wishlist toggle
;(window as any).toggleWishlist = (btn: HTMLElement, foodTitle: string) => {
  const icon = btn.querySelector('i')
  if (favoriteItems.has(foodTitle)) {
    favoriteItems.delete(foodTitle)
    icon?.classList.remove('fa-solid', 'text-red-500')
    icon?.classList.add('fa-regular')
    showToast(`Removed "${foodTitle}" from favorites`, 'info')
  } else {
    favoriteItems.add(foodTitle)
    icon?.classList.remove('fa-regular')
    icon?.classList.add('fa-solid', 'text-red-500')
    showToast(`Saved "${foodTitle}" to favorites! ❤️`, 'success')
  }
  updateFavCount()
}

function updateFavCount() {
  const favCount = document.getElementById('fav-count')
  if (favCount) favCount.textContent = favoriteItems.size.toString()
}

;(window as any).filterFavorites = () => {
  if (favoriteItems.size === 0) {
    showToast('Click the heart on any food card to add to favorites!', 'info')
    return
  }

  const cards = document.querySelectorAll<HTMLElement>('.food-card')
  cards.forEach((card) => {
    const title = card.getAttribute('data-title') || ''
    card.style.display = favoriteItems.has(title) ? 'flex' : 'none'
  })

  const filterStatus = document.getElementById('filter-status')
  const currentFilterName = document.getElementById('current-filter-name')
  if (filterStatus && currentFilterName) {
    filterStatus.classList.remove('hidden')
    filterStatus.classList.add('flex')
    currentFilterName.textContent = `Favorites (${favoriteItems.size})`
  }

  const popularSection = document.getElementById('popular-foods')
  if (popularSection) popularSection.scrollIntoView({ behavior: 'smooth' })
}

// Cart Drawer
;(window as any).openCartDrawer = () => {
  const backdrop = document.getElementById('cart-drawer-backdrop')
  const drawer = document.getElementById('cart-drawer')
  if (backdrop && drawer) {
    backdrop.classList.remove('hidden')
    setTimeout(() => {
      backdrop.classList.remove('opacity-0')
      backdrop.classList.add('opacity-100')
      drawer.classList.remove('translate-x-full')
      drawer.classList.add('translate-x-0')
    }, 10)
  }
}

;(window as any).closeCartDrawer = () => {
  const backdrop = document.getElementById('cart-drawer-backdrop')
  const drawer = document.getElementById('cart-drawer')
  if (backdrop && drawer) {
    backdrop.classList.remove('opacity-100')
    backdrop.classList.add('opacity-0')
    drawer.classList.remove('translate-x-0')
    drawer.classList.add('translate-x-full')
    setTimeout(() => backdrop.classList.add('hidden'), 300)
  }
}

;(window as any).addToCart = (title: string, price: number, image: string) => {
  const existing = cart.find(item => item.title === title)
  if (existing) {
    existing.quantity++
  } else {
    cart.push({
      id: Date.now().toString(),
      title,
      price,
      quantity: 1,
      image
    })
  }
  renderCart()
  showToast(`Added 1x "${title}" to Cart!`, 'success')
}

;(window as any).updateQuantity = (id: string, delta: number) => {
  const itemIndex = cart.findIndex(i => i.id === id)
  if (itemIndex > -1) {
    cart[itemIndex].quantity += delta
    if (cart[itemIndex].quantity <= 0) cart.splice(itemIndex, 1)
  }
  renderCart()
}

;(window as any).removeFromCart = (id: string) => {
  cart = cart.filter(i => i.id !== id)
  renderCart()
  showToast('Item removed from order', 'info')
}

function renderCart() {
  const list = document.getElementById('cart-items-list')
  const badge = document.getElementById('cart-badge')
  const countSpan = document.getElementById('drawer-item-count')
  const subtotalEl = document.getElementById('cart-subtotal')
  const taxEl = document.getElementById('cart-tax')
  const totalEl = document.getElementById('cart-total')
  const demoCartTotal = document.getElementById('demo-cart-total')

  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.05
  const total = subtotal + tax

  if (badge) badge.textContent = totalQuantity.toString()
  if (countSpan) countSpan.textContent = `${totalQuantity} item${totalQuantity === 1 ? '' : 's'}`
  if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`
  if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`
  if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`
  if (demoCartTotal) demoCartTotal.textContent = `$${total.toFixed(2)}`

  if (!list) return

  if (cart.length === 0) {
    list.innerHTML = `
      <div class="text-center py-12 space-y-2">
        <i class="fa-solid fa-cart-shopping text-3xl text-gray-300"></i>
        <p class="font-bold text-gray-800 text-sm">Your Cart is empty</p>
        <p class="text-xs text-gray-500">Add dishes to start ordering!</p>
      </div>
    `
    return
  }

  list.innerHTML = cart.map(item => `
    <div class="flex items-center gap-2.5 bg-white p-2.5 rounded-xl border border-gray-100 shadow-xs">
      <img src="${item.image}" alt="${item.title}" class="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
      <div class="flex-1 min-w-0">
        <h4 class="font-bold text-xs text-gray-900 truncate">${item.title}</h4>
        <p class="text-[11px] text-[#f59e0b] font-black mt-0.5">$${item.price.toFixed(2)}</p>
        <div class="flex items-center gap-2 mt-1.5">
          <div class="flex items-center border border-gray-200 rounded-md overflow-hidden bg-gray-50 text-[11px]">
            <button onclick="window.updateQuantity('${item.id}', -1)" class="w-5 h-5 flex items-center justify-center hover:bg-gray-200 font-bold cursor-pointer">-</button>
            <span class="w-6 text-center font-bold text-gray-800">${item.quantity}</span>
            <button onclick="window.updateQuantity('${item.id}', 1)" class="w-5 h-5 flex items-center justify-center hover:bg-gray-200 font-bold cursor-pointer">+</button>
          </div>
          <span class="text-[11px] font-semibold text-gray-600">= $${(item.price * item.quantity).toFixed(2)}</span>
        </div>
      </div>
      <button onclick="window.removeFromCart('${item.id}')" class="text-gray-400 hover:text-red-500 p-1.5 cursor-pointer">
        <i class="fa-solid fa-trash-can text-xs"></i>
      </button>
    </div>
  `).join('')
}

;(window as any).proceedToCheckout = () => {
  if (cart.length === 0) {
    showToast('Your cart is empty! Please add items first.', 'warning')
    return
  }
  ;(window as any).closeCartDrawer()
  showToast('🎉 Order #GC-9821 successfully placed! Kitchen is preparing your meal.', 'success')
}

// Book a Table Modal
;(window as any).openBookTableModal = () => document.getElementById('book-table-modal')?.classList.remove('hidden')
;(window as any).closeBookTableModal = () => document.getElementById('book-table-modal')?.classList.add('hidden')
;(window as any).handleReservation = (e: Event) => {
  e.preventDefault()
  ;(window as any).closeBookTableModal()
  showToast('🎉 Table successfully reserved! Confirmation SMS sent.', 'success')
}

// Offline Order Modal
;(window as any).openOfflineModal = (foodTitle: string) => {
  const titleEl = document.getElementById('offline-item-title')
  if (titleEl) titleEl.textContent = foodTitle
  document.getElementById('offline-order-modal')?.classList.remove('hidden')
}
;(window as any).closeOfflineModal = () => document.getElementById('offline-order-modal')?.classList.add('hidden')
;(window as any).confirmOfflineOrder = (type: string) => {
  ;(window as any).closeOfflineModal()
  showToast(`Ordered successfully for ${type}! Ticket #OFF-441.`, 'success')
}

// Special Claim Offer
;(window as any).claimOffer = () => {
  ;(window as any).addToCart('Woodfired Special Pizza', 9.99, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80')
  showToast('50% OFF promo applied to Special Pizza!', 'success')
  ;(window as any).openCartDrawer()
}

// AI Support Drawer
let aiCardVisible = true
;(window as any).toggleAISupportCard = () => {
  const card = document.getElementById('ai-support-card')
  if (!card) return
  aiCardVisible = !aiCardVisible
  if (aiCardVisible) {
    card.classList.remove('hidden', 'scale-0', 'opacity-0')
    card.classList.add('scale-100', 'opacity-100')
  } else {
    card.classList.add('scale-0', 'opacity-0')
    setTimeout(() => card.classList.add('hidden'), 200)
  }
}

;(window as any).openAIChatModal = () => document.getElementById('ai-chat-modal')?.classList.remove('hidden')
;(window as any).closeAIChatModal = () => document.getElementById('ai-chat-modal')?.classList.add('hidden')
;(window as any).sendPresetChat = (text: string) => {
  const input = document.getElementById('chat-user-input') as HTMLInputElement | null
  if (input) {
    input.value = text
    ;(window as any).handleChatSubmit(new Event('submit'))
  }
}

;(window as any).handleChatSubmit = (e: Event) => {
  e.preventDefault()
  const input = document.getElementById('chat-user-input') as HTMLInputElement | null
  if (!input || !input.value.trim()) return

  const userText = input.value.trim()
  input.value = ''
  appendChatMessage('user', userText)

  setTimeout(() => {
    let reply = "I'd be glad to help! Our chefs recommend our signature Margherita Pizza and the Supreme Classic Burger with golden french fries!"
    const lower = userText.toLowerCase()
    if (lower.includes('special') || lower.includes('deal') || lower.includes('50%')) {
      reply = "Today's highlight is our 50% OFF Special Italian Pizza offer! Click the arrow on the Special Offer banner to claim it now."
    } else if (lower.includes('burger')) {
      reply = "Our Classic Burger is 100% Halal beef, flame-grilled with cheddar cheese and fresh lettuce for only $8.99!"
    } else if (lower.includes('book') || lower.includes('table')) {
      reply = "You can book a cozy table directly via the 'Book a Table' button on the top banner! Would you prefer indoor or rooftop terrace?"
    }
    appendChatMessage('ai', reply)
  }, 600)
}

function appendChatMessage(sender: 'user' | 'ai', message: string) {
  const container = document.getElementById('chat-messages')
  if (!container) return
  const isUser = sender === 'user'
  const msgEl = document.createElement('div')
  msgEl.className = `flex items-start gap-2 ${isUser ? 'justify-end' : ''}`
  msgEl.innerHTML = isUser
    ? `<div class="bg-blue-600 text-white p-2.5 rounded-2xl rounded-tr-none text-xs max-w-[80%] shadow-xs">${message}</div>`
    : `<div class="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 text-[9px]">AI</div><div class="bg-white p-2.5 rounded-2xl rounded-tl-none border border-gray-200 shadow-xs text-gray-700 max-w-[80%]">${message}</div>`
  container.appendChild(msgEl)
  container.scrollTop = container.scrollHeight
}

;(window as any).openQRScannerModal = () => document.getElementById('qr-modal')?.classList.remove('hidden')
;(window as any).closeQRScannerModal = () => document.getElementById('qr-modal')?.classList.add('hidden')
;(window as any).simulateQRSuccess = () => {
  ;(window as any).closeQRScannerModal()
  showToast('Table #7 linked! Your order will be served directly to your table.', 'success')
}

;(window as any).openMapModal = () => document.getElementById('map-modal')?.classList.remove('hidden')
;(window as any).closeMapModal = () => document.getElementById('map-modal')?.classList.add('hidden')
;(window as any).openGoogleMapsDemo = () => window.open('https://maps.google.com/?q=123+Food+Street+Dhaka', '_blank')

;(window as any).openOrdersModal = () => (window as any).openCartDrawer()
;(window as any).openGiftModal = () => showToast('🎁 Gift voucher code "GRILL50" copied to clipboard!', 'info')
;(window as any).openGalleryModal = () => showToast('Viewing Grill & Chill Chef Photo Gallery', 'info')
;(window as any).openAboutModal = () => showToast('Grill & Chill was founded in 2018. Over 50,000+ happy customers served!', 'info')
;(window as any).toggleMobileMenu = () => document.getElementById('mobile-menu')?.classList.toggle('hidden')

;(window as any).handleNewsletter = (e: Event) => {
  e.preventDefault()
  showToast('Thank you! Discount voucher sent to your email.', 'success')
  const form = e.target as HTMLFormElement
  form.reset()
}

function showToast(message: string, type: 'success' | 'info' | 'warning' = 'success') {
  const container = document.getElementById('toast-container')
  if (!container) return

  const toast = document.createElement('div')
  toast.className = `pointer-events-auto transform transition-all duration-300 translate-y-2 opacity-0 flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl shadow-xl text-xs font-semibold max-w-sm border backdrop-blur-md ${
    type === 'success'
      ? 'bg-gray-900/95 text-white border-amber-400/40'
      : type === 'warning'
      ? 'bg-amber-600 text-white border-amber-500'
      : 'bg-blue-900/95 text-white border-blue-400/40'
  }`

  const iconClass = type === 'success' ? 'fa-circle-check text-[#f59e0b]' : type === 'warning' ? 'fa-triangle-exclamation text-white' : 'fa-circle-info text-sky-400'
  toast.innerHTML = `<i class="fa-solid ${iconClass} text-sm flex-shrink-0"></i><span class="flex-1 leading-snug">${message}</span>`

  container.appendChild(toast)

  setTimeout(() => {
    toast.classList.remove('translate-y-2', 'opacity-0')
    toast.classList.add('translate-y-0', 'opacity-100')
  }, 10)

  setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100')
    toast.classList.add('translate-y-2', 'opacity-0')
    setTimeout(() => toast.remove(), 300)
  }, 3500)
}
