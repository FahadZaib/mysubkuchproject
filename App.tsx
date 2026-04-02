
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { AppRoute, Product, CartItem, User, Banner, CarouselSlide, TeamMember, GalleryImage, Offer, Category, Order, ContactQuery, SiteSettings } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import Account from './pages/Account';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import Contact from './pages/Contact';
import Tracking from './pages/Tracking';
import { MOCK_PRODUCTS, CATEGORIES as INITIAL_CATEGORIES } from './constants';
import { getAIGroundedSearch } from './services/gemini';
import { db, auth } from './firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, onSnapshot, doc, setDoc, updateDoc, addDoc, getDoc, getDocs, query, where, deleteDoc } from 'firebase/firestore';

const DEFAULT_BANNER: Banner = {
  tagline: "Biggest Sale of the Season",
  title: "Everything You Need, All In One Place.",
  subtitle: "Discover thousands of products from local and international brands at unbeatable prices. From gadgets to fashion - we have it all!",
  cta: "Shop Now",
  image: "https://picsum.photos/seed/shopping/1920/1080"
};

const INITIAL_SLIDES: CarouselSlide[] = [
  {
    id: 's1',
    tagline: "WINTER COLLECTION 2024",
    title: "Elevate Your Style Every Single Day.",
    subtitle: "Discover the premium winter collection. Fixed 200 PKR delivery / Free over 10,000 PKR.",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1920",
    cta: "Explore Fashion",
    route: `${AppRoute.SHOP}?category=apparel`
  },
  {
    id: 's2',
    tagline: "TECH & GADGETS",
    title: "The Future of Innovation is Here.",
    subtitle: "Upgrade your lifestyle with the latest gadgets. Free delivery on orders over 10,000 PKR.",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1920",
    cta: "Shop Electronics",
    route: `${AppRoute.SHOP}?category=electronics`
  }
];

const INITIAL_TEAM: TeamMember[] = [
  { id: '1', name: 'Zohaib Ahmed', role: 'Founder & CEO', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400' },
  { id: '2', name: 'Sara Khan', role: 'Head of Fashion', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400' },
  { id: '3', name: 'Hamza Malik', role: 'Tech Lead', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400' },
  { id: '4', name: 'Ayesha Aziz', role: 'Customer Happiness', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400' }
];

const INITIAL_GALLERY: GalleryImage[] = [
  { id: 'g1', url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600', caption: 'Fashion for all seasons' },
  { id: 'g2', url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600', caption: 'Modern kitchen essentials' },
  { id: 'g3', url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600', caption: 'The latest gadgets' },
  { id: 'g4', url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600', caption: 'Shop premium brands' }
];

const useLocation = () => {
  const [hash, setHash] = useState(window.location.hash || '#/');
  useEffect(() => {
    const handleHashChange = () => { setHash(window.location.hash || '#/'); window.scrollTo(0, 0); };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
  const navigate = (to: string) => { window.location.hash = to; };
  return { hash, navigate };
};

const App: React.FC = () => {
  const { hash, navigate } = useLocation();
  
  const [registeredUsers, setRegisteredUsers] = useState<User[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [subscribers, setSubscribers] = useState<string[]>([]);
  const [contactQueries, setContactQueries] = useState<ContactQuery[]>([]);
  const [aboutContent, setAboutContent] = useState({
    title: "Everything in One Place.",
    description: "Welcome to SubKuch.pk, Pakistan's fastest-growing one-stop marketplace for quality products and exceptional service.",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800",
    stats: { customers: "50K+", products: "10K+" }
  });
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    showMegaSale: true,
    showFlashSale: true
  });
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [carouselSlides, setCarouselSlides] = useState<CarouselSlide[]>([]);
  const [banner, setBanner] = useState<Banner>(DEFAULT_BANNER);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<Product[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // Error Handler for Firestore
  const handleFirestoreError = (error: any, operationType: string, path: string | null) => {
    const errInfo = {
      error: error instanceof Error ? error.message : String(error),
      authInfo: {
        userId: auth.currentUser?.uid,
        email: auth.currentUser?.email,
        emailVerified: auth.currentUser?.emailVerified,
        isAnonymous: auth.currentUser?.isAnonymous,
        tenantId: auth.currentUser?.tenantId,
        providerInfo: auth.currentUser?.providerData.map(provider => ({
          providerId: provider.providerId,
          displayName: provider.displayName,
          email: provider.email,
          photoUrl: provider.photoURL
        })) || []
      },
      operationType,
      path
    };
    console.error('Firestore Error: ', JSON.stringify(errInfo));
    // Don't throw if it's just a permission error we expect for non-admins
    if (!error.message?.includes('insufficient permissions')) {
      // throw new Error(JSON.stringify(errInfo));
    }
  };

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          setUser(userDoc.data() as User);
        } else {
          // If user exists in Auth but not in Firestore (e.g. social login first time)
          const newUser: User = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || 'User',
            email: firebaseUser.email || '',
            role: 'user'
          };
          await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
          setUser(newUser);
        }
      } else {
        setUser(null);
      }
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  // Public Firestore Listeners
  useEffect(() => {
    const unsubProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Product)));
    }, (err) => handleFirestoreError(err, 'list', 'products'));

    const unsubCategories = onSnapshot(collection(db, 'categories'), (snapshot) => {
      setCategories(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Category)));
    }, (err) => handleFirestoreError(err, 'list', 'categories'));

    const unsubTeam = onSnapshot(collection(db, 'team'), (snapshot) => {
      setTeamMembers(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as TeamMember)));
    }, (err) => handleFirestoreError(err, 'list', 'team'));

    const unsubGallery = onSnapshot(collection(db, 'gallery'), (snapshot) => {
      setGalleryImages(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as GalleryImage)));
    }, (err) => handleFirestoreError(err, 'list', 'gallery'));

    const unsubSlides = onSnapshot(collection(db, 'slides'), (snapshot) => {
      setCarouselSlides(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as CarouselSlide)));
    }, (err) => handleFirestoreError(err, 'list', 'slides'));

    const bannerRef = doc(db, 'site_config', 'banner');
    const unsubBanner = onSnapshot(bannerRef, (snapshot) => {
      if (snapshot.exists()) setBanner(snapshot.data() as Banner);
    }, (err) => handleFirestoreError(err, 'get', 'site_config/banner'));

    const settingsRef = doc(db, 'site_config', 'settings');
    const unsubSettings = onSnapshot(settingsRef, (snapshot) => {
      if (snapshot.exists()) setSiteSettings(snapshot.data() as SiteSettings);
    }, (err) => handleFirestoreError(err, 'get', 'site_config/settings'));

    return () => {
      unsubProducts(); unsubCategories(); unsubTeam(); unsubGallery(); unsubSlides(); unsubBanner(); unsubSettings();
    };
  }, []);

  // Admin Data Seeding
  useEffect(() => {
    if (user?.role !== 'admin') return;

    const seedData = async () => {
      try {
        // Seed Products
        const prodSnap = await getDocs(collection(db, 'products'));
        if (prodSnap.empty) {
          for (const p of MOCK_PRODUCTS) {
            await setDoc(doc(db, 'products', p.id), p);
          }
        }

        // Seed Categories
        const catSnap = await getDocs(collection(db, 'categories'));
        if (catSnap.empty) {
          for (const c of INITIAL_CATEGORIES) {
            await setDoc(doc(db, 'categories', c.id), c);
          }
        }

        // Seed Team
        const teamSnap = await getDocs(collection(db, 'team'));
        if (teamSnap.empty) {
          for (const t of INITIAL_TEAM) {
            await setDoc(doc(db, 'team', t.id), t);
          }
        }

        // Seed Gallery
        const gallerySnap = await getDocs(collection(db, 'gallery'));
        if (gallerySnap.empty) {
          for (const g of INITIAL_GALLERY) {
            await setDoc(doc(db, 'gallery', g.id), g);
          }
        }

        // Seed Slides
        const slidesSnap = await getDocs(collection(db, 'slides'));
        if (slidesSnap.empty) {
          for (const s of INITIAL_SLIDES) {
            await setDoc(doc(db, 'slides', s.id), s);
          }
        }

        // Seed Banner
        const bannerSnap = await getDoc(doc(db, 'site_config', 'banner'));
        if (!bannerSnap.exists()) {
          await setDoc(doc(db, 'site_config', 'banner'), DEFAULT_BANNER);
        }

        // Seed Settings
        const settingsSnap = await getDoc(doc(db, 'site_config', 'settings'));
        if (!settingsSnap.exists()) {
          await setDoc(doc(db, 'site_config', 'settings'), { showMegaSale: true, showFlashSale: true });
        }
      } catch (err) {
        handleFirestoreError(err, 'write', 'seeding');
      }
    };

    seedData();
  }, [user]);

  // Private/Admin Firestore Listeners
  useEffect(() => {
    if (!isAuthReady) return;

    let unsubUsers = () => {};
    let unsubOrders = () => {};
    let unsubQueries = () => {};

    if (user?.role === 'admin') {
      unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
        setRegisteredUsers(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as User)));
      }, (err) => handleFirestoreError(err, 'list', 'users'));
      unsubOrders = onSnapshot(collection(db, 'orders'), (snapshot) => {
        setOrders(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Order)));
      }, (err) => handleFirestoreError(err, 'list', 'orders'));
      unsubQueries = onSnapshot(collection(db, 'queries'), (snapshot) => {
        setContactQueries(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as ContactQuery)));
      }, (err) => handleFirestoreError(err, 'list', 'queries'));
    } else if (user) {
      // Logged in user - listen to their own orders
      const q = query(collection(db, 'orders'), where('customerEmail', '==', user.email));
      unsubOrders = onSnapshot(q, (snapshot) => {
        setOrders(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Order)));
      }, (err) => handleFirestoreError(err, 'list', 'orders_personal'));
    }

    return () => {
      unsubUsers(); unsubOrders(); unsubQueries();
    };
  }, [user, isAuthReady]);

  const onAddToCart = (product: Product) => {
    if (product.stock <= 0) { alert("Sorry, this item is out of stock!"); return; }
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const onToggleWishlist = (productId: string) => {
    setWishlist(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);
  };

  const onPlaceOrder = async (newOrder: Order) => {
    try {
      await addDoc(collection(db, 'orders'), newOrder);
      for (const item of newOrder.items) {
        const productRef = doc(db, 'products', item.id);
        const productDoc = await getDoc(productRef);
        if (productDoc.exists()) {
          const currentStock = productDoc.data().stock;
          await updateDoc(productRef, { stock: Math.max(0, currentStock - item.quantity) });
        }
      }
      setCart([]);
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  const onSubscribe = async (email: string) => {
    if (!email || !email.includes('@')) return false;
    try {
      await addDoc(collection(db, 'subscribers'), { email, date: new Date().toISOString() });
      return true;
    } catch (error) {
      console.error("Error subscribing:", error);
      return false;
    }
  };

  const onContactSubmit = async (query: ContactQuery) => {
    try {
      await addDoc(collection(db, 'queries'), query);
    } catch (error) {
      console.error("Error submitting query:", error);
    }
  };

  const handleRegister = async (newUser: User, password?: string) => {
    if (!password) return;
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, newUser.email, password);
      const userWithId = { ...newUser, id: userCredential.user.uid };
      await setDoc(doc(db, 'users', userCredential.user.uid), userWithId);
      setUser(userWithId);
      navigate(AppRoute.HOME);
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleLogin = async (email: string, pass: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, pass);
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data() as User;
        if (userData.isBlocked) { alert("Account Deactivated."); await signOut(auth); return false; }
        setUser(userData);
        if (userData.role === 'admin') navigate(AppRoute.DASHBOARD);
        else navigate(AppRoute.HOME);
        return true;
      }
      return false;
    } catch (error: any) {
      alert(error.message);
      return false;
    }
  };

  const handleSocialAuth = (provider: 'google' | 'facebook') => {
    alert("Social auth should be implemented with Firebase Auth providers.");
  };

  const onUpdateProduct = async (updatedProduct: Product) => {
    try {
      await updateDoc(doc(db, 'products', updatedProduct.id), updatedProduct as any);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const onSearch = async (query: string) => {
    if (!query.trim()) { setSearchResults(null); return; }
    setIsSearching(true);
    navigate(AppRoute.SHOP);
    const results = await getAIGroundedSearch(query, products);
    setSearchResults(results);
    setIsSearching(false);
  };

  const renderPage = () => {
    const path = hash.split('?')[0];
    const queryStr = hash.split('?')[1] || '';
    const queryParams = new URLSearchParams(queryStr);

    if (path === AppRoute.HOME || path === '#/') {
      return (
        <Home 
          onNavigate={navigate} 
          onAddToCart={onAddToCart} 
          wishlist={wishlist} 
          onToggleWishlist={onToggleWishlist} 
          products={products}
          carouselSlides={carouselSlides}
          onSubscribe={onSubscribe}
          siteSettings={siteSettings}
          galleryImages={galleryImages}
        />
      );
    }
    
    if (path === AppRoute.SHOP) {
      return (
        <Shop 
          initialCategory={queryParams.get('category') || undefined} 
          onNavigate={navigate} 
          onAddToCart={onAddToCart} 
          wishlist={wishlist}
          onToggleWishlist={onToggleWishlist}
          searchResults={searchResults}
          isSearching={isSearching}
          clearSearch={() => setSearchResults(null)}
          products={products}
          categories={categories}
        />
      );
    }

    if (path.startsWith('#/product/')) {
      const productId = path.replace('#/product/', '');
      const product = products.find(p => p.id === productId);
      if (!product) return <div className="p-20 text-center font-bold text-gray-400">Item not found.</div>;
      return (
        <ProductDetail 
          productId={productId} 
          onNavigate={navigate} 
          onAddToCart={onAddToCart} 
          wishlist={wishlist} 
          onToggleWishlist={onToggleWishlist} 
          products={products}
          onUpdateProduct={onUpdateProduct}
          user={user}
        />
      );
    }

    if (path === AppRoute.CHECKOUT) return <Checkout cart={cart} user={user} onNavigate={navigate} onPlaceOrder={onPlaceOrder} />;

    if (path === AppRoute.ACCOUNT) {
      if (!user) { navigate(AppRoute.LOGIN); return null; }
      return (
        <Account 
          onNavigate={navigate} 
          wishlist={wishlist} 
          onToggleWishlist={onToggleWishlist} 
          onAddToCart={onAddToCart} 
          onLogout={async () => { await signOut(auth); setUser(null); }} 
          user={user} 
          onUpdateUser={async (updated) => {
            await updateDoc(doc(db, 'users', updated.id), updated as any);
            setUser(updated);
          }} 
          orders={orders.filter(o => o.customerEmail === user.email)}
          onUpdateOrders={async (newOrders) => {
            const currentIds = orders.map(o => o.id);
            const newIds = newOrders.map(o => o.id);
            for (const o of newOrders) {
              await setDoc(doc(db, 'orders', o.id), o);
            }
            for (const id of currentIds) {
              if (!newIds.includes(id)) {
                await deleteDoc(doc(db, 'orders', id));
              }
            }
          }}
          allOrders={orders}
        />
      );
    }

    if (path === AppRoute.DASHBOARD) {
      if (!user || user.role !== 'admin') { navigate(AppRoute.HOME); return null; }
      return (
        <AdminDashboard 
          onNavigate={navigate} 
          products={products}
          onUpdateProducts={async (newProducts) => {
            // This is a bit tricky because AdminDashboard sometimes passes the whole array
            // We should ideally have granular update/add/delete functions
            // But for now, let's try to sync the changes
            const currentIds = products.map(p => p.id);
            const newIds = newProducts.map(p => p.id);
            
            // Added or Updated
            for (const p of newProducts) {
              await setDoc(doc(db, 'products', p.id), p);
            }
            // Deleted
            for (const id of currentIds) {
              if (!newIds.includes(id)) {
                await deleteDoc(doc(db, 'products', id));
              }
            }
          }}
          categories={categories}
          onUpdateCategories={async (newCats) => {
            const currentIds = categories.map(c => c.id);
            const newIds = newCats.map(c => c.id);
            for (const c of newCats) {
              await setDoc(doc(db, 'categories', c.id), c);
            }
            for (const id of currentIds) {
              if (!newIds.includes(id)) {
                await deleteDoc(doc(db, 'categories', id));
              }
            }
          }}
          users={registeredUsers}
          onUpdateUsers={async (newUsers) => {
            const currentIds = registeredUsers.map(u => u.id);
            const newIds = newUsers.map(u => u.id);
            for (const u of newUsers) {
              await setDoc(doc(db, 'users', u.id), u);
            }
            for (const id of currentIds) {
              if (!newIds.includes(id)) {
                await deleteDoc(doc(db, 'users', id));
              }
            }
          }}
          orders={orders}
          onUpdateOrders={async (newOrders) => {
            const currentIds = orders.map(o => o.id);
            const newIds = newOrders.map(o => o.id);
            for (const o of newOrders) {
              await setDoc(doc(db, 'orders', o.id), o);
            }
            for (const id of currentIds) {
              if (!newIds.includes(id)) {
                await deleteDoc(doc(db, 'orders', id));
              }
            }
          }}
          currentUser={user}
          banner={banner}
          onUpdateBanner={async (b) => await setDoc(doc(db, 'site_config', 'banner'), b)}
          carouselSlides={carouselSlides}
          onUpdateSlides={async (newSlides) => {
            const currentIds = carouselSlides.map(s => s.id);
            const newIds = newSlides.map(s => s.id);
            for (const s of newSlides) {
              await setDoc(doc(db, 'slides', s.id), s);
            }
            for (const id of currentIds) {
              if (!newIds.includes(id)) {
                await deleteDoc(doc(db, 'slides', id));
              }
            }
          }}
          teamMembers={teamMembers}
          onUpdateTeam={async (newTeam) => {
            const currentIds = teamMembers.map(m => m.id);
            const newIds = newTeam.map(m => m.id);
            for (const m of newTeam) {
              await setDoc(doc(db, 'team', m.id), m);
            }
            for (const id of currentIds) {
              if (!newIds.includes(id)) {
                await deleteDoc(doc(db, 'team', id));
              }
            }
          }}
          galleryImages={galleryImages}
          onUpdateGallery={async (newGallery) => {
            const currentIds = galleryImages.map(g => g.id);
            const newIds = newGallery.map(g => g.id);
            for (const g of newGallery) {
              await setDoc(doc(db, 'gallery', g.id), g);
            }
            for (const id of currentIds) {
              if (!newIds.includes(id)) {
                await deleteDoc(doc(db, 'gallery', id));
              }
            }
          }}
          subscribers={subscribers}
          contactQueries={contactQueries}
          aboutContent={aboutContent}
          onUpdateAbout={async (a) => await setDoc(doc(db, 'site_config', 'about'), a)}
          siteSettings={siteSettings}
          onUpdateSiteSettings={async (s) => await setDoc(doc(db, 'site_config', 'settings'), s)}
        />
      );
    }

    if (path === AppRoute.TRACKING) return <Tracking orders={orders} />;
    if (path === AppRoute.LOGIN) return <Login onNavigate={navigate} onLoginAttempt={handleLogin} onSocialAuth={handleSocialAuth} />;
    if (path === AppRoute.REGISTER) {
      return (
        <Register 
          onNavigate={navigate} 
          onRegister={handleRegister} 
          existingEmails={registeredUsers.map(u => u.email.toLowerCase())} 
          existingPhones={registeredUsers.map(u => u.phone || '')}
          onSocialAuth={handleSocialAuth} 
        />
      );
    }
    if (path === AppRoute.ABOUT) return <About content={aboutContent} teamMembers={teamMembers} />;
    if (path === AppRoute.CONTACT) return <Contact onSubmit={onContactSubmit} />;
    
    return <div className="p-20 text-center"><h2 className="text-3xl font-black text-gray-900">404: Not Found</h2><button onClick={() => navigate(AppRoute.HOME)} className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold mt-4">Go Home</button></div>;
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-emerald-100">
      <Header cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} onNavigate={navigate} onOpenCart={() => setIsCartOpen(true)} onSearch={onSearch} user={user} categories={categories} orders={orders} />
      <main className="flex-grow">{renderPage()}</main>
      <Footer />
      {isCartOpen && <div className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl transition-transform duration-300 transform ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between"><h2 className="text-xl font-black">Shopping Cart</h2><button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-gray-50 rounded-full transition-colors"><X /></button></div>
          <div className="flex-grow overflow-y-auto p-6 space-y-6 no-scrollbar">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-3xl">🛒</div>
                <h3 className="font-bold text-gray-900">Your cart is empty</h3>
              </div>
            ) : cart.map(item => (
              <div key={item.id} className="flex gap-4 group">
                <img src={item.images[0]} className="w-16 h-20 object-cover rounded-xl shadow-sm" />
                <div className="flex-grow">
                  <h4 className="text-sm font-bold text-gray-900 line-clamp-1">{item.name}</h4>
                  <p className="text-emerald-600 font-black text-sm">Rs. {item.price.toLocaleString()}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <button onClick={() => setCart(prev => prev.map(p => p.id === item.id ? {...p, quantity: Math.max(0, p.quantity - 1)} : p).filter(p => p.quantity > 0))} className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center border text-xs font-black">-</button>
                    <span className="text-xs font-black w-4 text-center">{item.quantity}</span>
                    <button onClick={() => setCart(prev => prev.map(p => p.id === item.id ? {...p, quantity: p.quantity + 1} : p))} className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center border text-xs font-black">+</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {cart.length > 0 && (
            <div className="p-8 border-t space-y-6 bg-gray-50/50">
              <div className="flex justify-between font-black text-gray-900">
                <span className="text-sm uppercase tracking-widest text-gray-400">Subtotal</span>
                <span className="text-lg">Rs. {cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()}</span>
              </div>
              <button onClick={() => { setIsCartOpen(false); navigate(AppRoute.CHECKOUT); }} className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black text-sm shadow-xl hover:bg-emerald-700 transition-all">Proceed to Checkout</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
