import React,{useEffect,useMemo,useState}from"react";
import{createRoot}from"react-dom/client";
import{initializeApp}from"firebase/app";
import{getAnalytics}from"firebase/analytics";
import{getFirestore,collection,getDocs,addDoc,updateDoc,deleteDoc,doc,serverTimestamp}from"firebase/firestore";
import{getAuth,onAuthStateChanged,signInWithEmailAndPassword,signOut}from"firebase/auth";
import"./styles.css";

const firebaseConfig={
  apiKey:"AIzaSyBW4Gqi8poz037AoMFZWhgGGOebuLgXwIs",
  authDomain:"atharva-store-online.firebaseapp.com",
  projectId:"atharva-store-online",
  storageBucket:"atharva-store-online.firebasestorage.app",
  messagingSenderId:"482473558807",
  appId:"1:482473558807:web:8480ae69cf3f77c3206d52",
  measurementId:"G-4JQ3W27NB5"
};
const app=initializeApp(firebaseConfig);
getAnalytics(app);
const db=getFirestore(app);
const auth=getAuth(app);

const cats=[["Grocery","🛒"],["Fresh Food","🥬"],["Dairy & Bakery","🥛"],["Beverages","🥤"],["Snacks & Packaged Food","🍿"],["Frozen Food","❄️"],["Home & Kitchen","🏠"],["Personal Care","🧴"],["Household","🧹"],["Stationery","✏️"],["Travel","🧳"],["Baby Care","🍼"]];
const subs=["Dals & Pulses","Cooking Oil","Rice","Atta & Flours","Spices & Masala","Fruits","Vegetables","Milk","Curd & Yogurt","Butter & Cheese","Bread & Bakery","Tea & Coffee","Juices","Biscuits","Chips & Namkeen","Chocolates","Noodles","Frozen Snacks","Ice Cream","Cleaning","Kitchen Tools","Bath & Body","Hair Care","Oral Care","Laundry","School Supplies","Bags & Luggage","Diapers"];

function Card({p,add}){return <article className="card"><div className="pic">{p.image?<img src={p.image} alt={p.name}/>:p.emoji||"🛒"}{p.deal&&<small>DEAL</small>}</div><b>{p.name}</b><small>{p.unit}</small><div><strong>₹{p.price}</strong> {p.mrp>p.price&&<del>₹{p.mrp}</del>}<button onClick={()=>add(p)}>＋</button></div></article>}

function App(){
 const[cart,setCart]=useState([]);
 const[products,setProducts]=useState([]);
 const[q,setQ]=useState("");
 const[page,setPage]=useState("home");
 const[login,setLogin]=useState(false);
 const[adminLogin,setAdminLogin]=useState(false);
 const[admin,setAdmin]=useState(null);
 const[adminEmail,setAdminEmail]=useState("");
 const[adminPassword,setAdminPassword]=useState("");
 const[adminError,setAdminError]=useState("");
 const[loading,setLoading]=useState(true);
 const[form,setForm]=useState({name:"",unit:"",price:"",mrp:"",category:"Grocery",subcategory:"",image:"",emoji:"🛒",deal:false,stock:""});
 const[editing,setEditing]=useState(null);
 
 const loadProducts=async()=>{setLoading(true);try{const snap=await getDocs(collection(db,"products"));setProducts(snap.docs.map(d=>({id:d.id,...d.data()})));}catch(e){console.error(e);setProducts([])}finally{setLoading(false)}};
 useEffect(()=>{loadProducts();const unsub=onAuthStateChanged(auth,u=>setAdmin(u));return()=>unsub()},[]);
 const filtered=useMemo(()=>products.filter(p=>p.name?.toLowerCase().includes(q.toLowerCase())),[products,q]);
 const add=p=>setCart(c=>{const i=c.findIndex(x=>x.id===p.id);if(i<0)return[...c,{...p,qty:1}];return c.map((x,j)=>j===i?{...x,qty:(x.qty||1)+1}:x)});
 const saveProduct=async e=>{e.preventDefault();if(!form.name||!form.price){alert("Product name and price are required.");return}const data={...form,price:Number(form.price),mrp:Number(form.mrp||form.price),stock:Number(form.stock||0),updatedAt:serverTimestamp()};try{if(editing){await updateDoc(doc(db,"products",editing),data)}else{await addDoc(collection(db,"products"),{...data,createdAt:serverTimestamp()})}setForm({name:"",unit:"",price:"",mrp:"",category:"Grocery",subcategory:"",image:"",emoji:"🛒",deal:false,stock:""});setEditing(null);await loadProducts()}catch(err){alert("Save failed. Check Firebase permissions.")}};
 const editProduct=p=>{setEditing(p.id);setForm({name:p.name||"",unit:p.unit||"",price:p.price||"",mrp:p.mrp||"",category:p.category||"Grocery",subcategory:p.subcategory||"",image:p.image||"",emoji:p.emoji||"🛒",deal:!!p.deal,stock:p.stock??""})};
 const removeProduct=async id=>{if(!confirm("Delete this product?"))return;try{await deleteDoc(doc(db,"products",id));await loadProducts()}catch(e){alert("Delete failed. Check Firebase permissions.")}};
 const adminSignIn=async()=>{setAdminError("");try{await signInWithEmailAndPassword(auth,adminEmail.trim(),adminPassword);setAdminLogin(false);setPage("admin")}catch(e){setAdminError("Login failed. Check admin email/password and Firebase Authentication.")}};
 const logout=async()=>{await signOut(auth);setPage("home")};

 return <><header><div className="top"><button className="brand" onClick={()=>setPage("home")}>Atharva Store</button><button className="loc">📍 Select location</button><div className="search">🔎<input value={q} onChange={e=>{setQ(e.target.value);setPage("search")}} placeholder="Search products, brands and more"/></div><button onClick={()=>setPage("profile")}>👤 Account</button><button onClick={()=>setPage("cart")}>🛒 <b>{cart.reduce((s,p)=>s+(p.qty||1),0)}</b></button></div><nav>{["Categories","Deals","Fresh Food","Grocery","Dairy & Bakery","Beverages","Household","Personal Care"].map(x=><button key={x} onClick={()=>setPage(x.toLowerCase())}>{x}</button>)}</nav></header><main>
 {page==="home"&&<><section className="hero"><div><small>GROCERY STORE</small><h1>Everyday groceries,<br/><em>delivered fresh.</em></h1><p>Shop your daily essentials with easy home delivery.</p><button className="primary" onClick={()=>setPage("categories")}>Shop now</button></div><div className="heroicon">🛒</div></section><h2>Shop by category</h2><div className="catgrid">{cats.map(c=><button key={c[0]} onClick={()=>setPage(c[0].toLowerCase())}><span>{c[1]}</span><b>{c[0]}</b></button>)}</div><div className="head"><h2>Products</h2><button onClick={()=>setPage("products")}>View all →</button></div><div className="grid">{loading?<div className="empty"><h2>Loading products…</h2></div>:filtered.length?filtered.map(p=><Card key={p.id} p={p} add={add}/>):<div className="empty"><h2>No products yet</h2><p>Products will appear here after they are added from the admin panel.</p></div>}</div></>}
 {(page==="categories"||cats.some(c=>page===c[0].toLowerCase()))&&<><h1>Categories</h1><div className="mega">{cats.map(c=><section key={c[0]}><h2>{c[1]} {c[0]}</h2><div>{subs.slice(0,6).map(s=><button key={s} onClick={()=>setPage("products")}>{s}</button>)}</div></section>)}</div></>}
 {["deals","products","search","grocery","fresh food","dairy & bakery","beverages","household","personal care"].includes(page)&&<><div className="head"><div><h1>{page==="search"&&q?"Search: "+q:page==="deals"?"Deals":"Products"}</h1><p>{filtered.length} products</p></div></div><div className="grid">{filtered.length?filtered.map(p=><Card key={p.id} p={p} add={add}/>):<div className="empty"><h2>No products available</h2><p>Products will be added from the admin panel.</p></div>}</div></>}
 {page==="cart"&&<><h1>Your cart</h1>{!cart.length?<div className="empty">🛒<h2>Your cart is empty</h2><button className="primary" onClick={()=>setPage("categories")}>Start shopping</button></div>:<div className="cart"><div>{cart.map((p,i)=><div className="cartitem" key={p.id||i}><span className="cart-icon">{p.emoji||"🛒"}</span><div className="cart-info"><b>{p.name}</b><small>{p.unit}</small></div><div className="cart-actions"><strong>₹{p.price*(p.qty||1)}</strong><div className="qty-controls"><button type="button" onClick={()=>setCart(c=>c.flatMap((x,j)=>j!==i?x:(x.qty||1)>1?[{...x,qty:x.qty-1}]:[]))}>−</button><b>{p.qty||1}</b><button type="button" onClick={()=>setCart(c=>c.map((x,j)=>j===i?{...x,qty:(x.qty||1)+1}:x))}>＋</button></div><button className="remove-btn" type="button" onClick={()=>setCart(c=>c.filter((_,j)=>j!==i))}>Remove</button></div></div>)}</div><aside><h2>Order summary</h2><p>Subtotal <b>₹{cart.reduce((s,p)=>s+p.price*(p.qty||1),0)}</b></p><button className="primary" onClick={()=>setPage("checkout")}>Checkout</button></aside></div>}</>}
 {page==="checkout"&&<div className="checkout"><h1>Checkout</h1><input placeholder="Full name"/><input placeholder="Mobile number"/><textarea placeholder="Full delivery address"></textarea><select><option>Today, 5 PM – 7 PM</option><option>Today, 7 PM – 9 PM</option></select><h2>Payment</h2><label><input type="radio" defaultChecked name="pay"/> Cash on Delivery</label><label><input type="radio" name="pay"/> Online Payment</label><button className="primary" onClick={()=>setPage("orders")}>Place order</button></div>}
 {page==="orders"&&<><h1>My orders</h1><div className="empty"><h2>No orders yet</h2><p>Your orders will appear here after you place an order.</p></div></>}
 {page==="profile"&&<><h1>My account</h1><div className="profile">👤 <b>{admin?.email||"Guest customer"}</b>{admin?<button onClick={logout}>Logout</button>:<button onClick={()=>setLogin(true)}>Login / Register</button>}</div></>}
 {page==="admin"&&<><div className="head"><div><h1>Admin Panel</h1><p>{admin?.email||"Admin"} · {products.length} products</p></div><button onClick={logout}>Logout</button></div><form className="checkout" onSubmit={saveProduct}><h2>{editing?"Edit product":"Add product"}</h2><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Product name *"/><input value={form.unit} onChange={e=>setForm({...form,unit:e.target.value})} placeholder="Unit e.g. 1 kg, 500 ml"/><input type="number" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} placeholder="Selling price *"/><input type="number" value={form.mrp} onChange={e=>setForm({...form,mrp:e.target.value})} placeholder="MRP"/><select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>{cats.map(c=><option key={c[0]}>{c[0]}</option>)}</select><input value={form.subcategory} onChange={e=>setForm({...form,subcategory:e.target.value})} placeholder="Subcategory"/><input value={form.image} onChange={e=>setForm({...form,image:e.target.value})} placeholder="Product image URL (Storage not enabled)"/><input value={form.emoji} onChange={e=>setForm({...form,emoji:e.target.value})} placeholder="Fallback emoji"/><input type="number" value={form.stock} onChange={e=>setForm({...form,stock:e.target.value})} placeholder="Stock quantity"/><label><input type="checkbox" checked={form.deal} onChange={e=>setForm({...form,deal:e.target.checked})}/> Show as deal</label><div><button className="primary" type="submit">{editing?"Update product":"Add product"}</button>{editing&&<button type="button" onClick={()=>{setEditing(null);setForm({name:"",unit:"",price:"",mrp:"",category:"Grocery",subcategory:"",image:"",emoji:"🛒",deal:false,stock:""})}}>Cancel</button>}</div></form><h2>Products</h2><div className="grid">{products.map(p=><article className="card" key={p.id}><div className="pic">{p.image?<img src={p.image} alt={p.name}/>:p.emoji||"🛒"}</div><b>{p.name}</b><small>{p.unit} · ₹{p.price} · Stock {p.stock??0}</small><div><button onClick={()=>editProduct(p)}>Edit</button><button onClick={()=>removeProduct(p.id)}>Delete</button></div></article>)}</div></>}
 </main><footer>© Atharva Store · <button onClick={()=>setPage("profile")}>Account</button> · <button onClick={()=>setPage("orders")}>Orders</button> · <button onClick={()=>setPage("categories")}>Categories</button> · <button onClick={()=>admin?setPage("admin"):setAdminLogin(true)}>Admin</button></footer>
 {login&&<div className="modal"><div><button className="x" onClick={()=>setLogin(false)}>×</button><h2>Customer Login</h2><input placeholder="Mobile number"/><input type="password" placeholder="Password"/><button className="primary">Login</button><p>Customer authentication will be connected separately.</p></div></div>}
 {adminLogin&&<div className="modal"><div><button className="x" onClick={()=>setAdminLogin(false)}>×</button><h2>Admin Login</h2><input type="email" value={adminEmail} onChange={e=>setAdminEmail(e.target.value)} placeholder="Admin email"/><input type="password" value={adminPassword} onChange={e=>setAdminPassword(e.target.value)} placeholder="Password"/>{adminError&&<p>{adminError}</p>}<button className="primary" onClick={adminSignIn}>Login</button></div></div>}
 </>}
createRoot(document.getElementById("root")).render(<App/>);
