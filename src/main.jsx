import React,{useState}from"react";
import{createRoot}from"react-dom/client";
import{initializeApp}from"firebase/app";
import{getAnalytics}from"firebase/analytics";
import{getFirestore}from"firebase/firestore";
import{getStorage}from"firebase/storage";
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
const analytics=getAnalytics(app);
const db=getFirestore(app);
const storage=getStorage(app);
const cats=[["Grocery","🛒"],["Fresh Food","🥬"],["Dairy & Bakery","🥛"],["Beverages","🥤"],["Snacks & Packaged Food","🍿"],["Frozen Food","❄️"],["Home & Kitchen","🏠"],["Personal Care","🧴"],["Household","🧹"],["Stationery","✏️"],["Travel","🧳"],["Baby Care","🍼"]];
const subs=["Dals & Pulses","Cooking Oil","Rice","Atta & Flours","Spices & Masala","Fruits","Vegetables","Milk","Curd & Yogurt","Butter & Cheese","Bread & Bakery","Tea & Coffee","Juices","Biscuits","Chips & Namkeen","Chocolates","Noodles","Frozen Snacks","Ice Cream","Cleaning","Kitchen Tools","Bath & Body","Hair Care","Oral Care","Laundry","School Supplies","Bags & Luggage","Diapers"];
const products=[];
function Card({p,add,i}){return <article className="card"><div className="pic">{p[4]}{i%3===0&&<small>DEAL</small>}</div><b>{p[0]}</b><small>{p[1]}</small><div><strong>₹{p[2]}</strong> <del>₹{p[3]}</del><button onClick={()=>add(p)}>＋</button></div></article>}
function App(){const[cart,setCart]=useState([]);const[q,setQ]=useState("");const[page,setPage]=useState("home");const[login,setLogin]=useState(false);const add=p=>setCart(c=>[...c,p]);const filtered=products.filter(p=>p[0].toLowerCase().includes(q.toLowerCase()));return <><header><div className="top"><button className="brand" onClick={()=>setPage("home")}>Atharva Store</button><button className="loc">📍 Select location</button><div className="search">🔎<input value={q} onChange={e=>{setQ(e.target.value);setPage("search")}} placeholder="Search products, brands and more"/></div><button onClick={()=>setLogin(true)}>👤 Account</button><button onClick={()=>setPage("cart")}>🛒 <b>{cart.length}</b></button></div><nav>{["Categories","Deals","Fresh Food","Grocery","Dairy & Bakery","Beverages","Household","Personal Care"].map(x=><button key={x} onClick={()=>setPage(x.toLowerCase())}>{x}</button>)}</nav></header><main>
{page==="home"&&<><section className="hero"><div><small>GROCERY STORE</small><h1>Everyday groceries,<br/><em>delivered fresh.</em></h1><p>Shop your daily essentials with easy home delivery.</p><button className="primary" onClick={()=>setPage("categories")}>Shop now</button></div><div className="heroicon">🛒</div></section><h2>Shop by category</h2><div className="catgrid">{cats.map(c=><button key={c[0]} onClick={()=>setPage(c[0].toLowerCase())}><span>{c[1]}</span><b>{c[0]}</b></button>)}</div><div className="head"><h2>Deals for you</h2><button onClick={()=>setPage("deals")}>View all →</button></div><div className="grid">{products.length?<>{products.filter((_,i)=>i%2===0).map((p,i)=><Card key={i} p={p} add={add} i={i}/>)}</>:<div className="empty"><h2>No products yet</h2><p>Products will appear here after they are added from the admin panel.</p></div>}</div></>}
{(page==="categories"||cats.some(c=>page===c[0].toLowerCase()))&&<><h1>Categories</h1><div className="mega">{cats.map(c=><section key={c[0]}><h2>{c[1]} {c[0]}</h2><div>{subs.slice(0,6).map(s=><button key={s} onClick={()=>setPage("products")}>{s}</button>)}</div></section>)}</div></>}
{(["deals","products","search","grocery","fresh food","dairy & bakery","beverages","household","personal care"].includes(page))&&<><div className="head"><div><h1>{page==="search"&&q?("Search: "+q):page==="deals"?"Deals":"Products"}</h1><p>{filtered.length} products</p></div></div><div className="grid">{filtered.length?filtered.map((p,i)=><Card key={i} p={p} add={add} i={i}/>):<div className="empty"><h2>No products available</h2><p>Products will be added from the admin panel.</p></div>}</div></>}
{page==="cart"&&<><h1>Your cart</h1>{!cart.length?<div className="empty">🛒<h2>Your cart is empty</h2><button className="primary" onClick={()=>setPage("categories")}>Start shopping</button></div>:<div className="cart"><div>{cart.map((p,i)=><div className="cartitem" key={i}><span>{p[4]}</span><div><b>{p[0]}</b><small>{p[1]}</small></div><strong>₹{p[2]}</strong><button onClick={()=>setCart(c=>c.filter((_,j)=>j!==i))}>Remove</button></div>)}</div><aside><h2>Order summary</h2><p>Subtotal <b>₹{cart.reduce((s,p)=>s+p[2],0)}</b></p><button className="primary" onClick={()=>setPage("checkout")}>Checkout</button></aside></div>}</>}
{page==="checkout"&&<div className="checkout"><h1>Checkout</h1><input placeholder="Full name"/><input placeholder="Mobile number"/><textarea placeholder="Full delivery address"></textarea><select><option>Today, 5 PM – 7 PM</option><option>Today, 7 PM – 9 PM</option></select><h2>Payment</h2><label><input type="radio" defaultChecked name="pay"/> Cash on Delivery</label><label><input type="radio" name="pay"/> Online Payment</label><button className="primary" onClick={()=>setPage("orders")}>Place order</button></div>}
{page==="orders"&&<><h1>My orders</h1><div className="empty"><h2>No orders yet</h2><p>Your orders will appear here after you place an order.</p></div></>}
{page==="profile"&&<><h1>My account</h1><div className="profile">👤 <b>Guest customer</b><button onClick={()=>setLogin(true)}>Login / Register</button></div></>}
</main><footer>© Atharva Store · <button onClick={()=>setPage("profile")}>Account</button> · <button onClick={()=>setPage("orders")}>Orders</button> · <button onClick={()=>setPage("categories")}>Categories</button></footer>{login&&<div className="modal"><div><button className="x" onClick={()=>setLogin(false)}>×</button><h2>Login</h2><input placeholder="Mobile number"/><input type="password" placeholder="Password"/><button className="primary">Login</button><p>New customer? Mobile → OTP → Create password</p></div></div>}</>}
createRoot(document.getElementById("root")).render(<App/>);