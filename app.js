const products=[
{id:1,name:"Fresh Bananas",cat:"Fruits",unit:"1 kg",price:49,old:59,e:"🍌",b:"Fresh"},
{id:2,name:"Red Apples",cat:"Fruits",unit:"1 kg",price:149,old:179,e:"🍎",b:"Popular"},
{id:3,name:"Tomatoes",cat:"Vegetables",unit:"1 kg",price:39,old:49,e:"🍅",b:"Fresh"},
{id:4,name:"Potatoes",cat:"Vegetables",unit:"1 kg",price:35,old:45,e:"🥔",b:"Value"},
{id:5,name:"Full Cream Milk",cat:"Dairy",unit:"1 litre",price:64,old:68,e:"🥛",b:"Daily"},
{id:6,name:"Farm Eggs",cat:"Dairy",unit:"12 pcs",price:89,old:99,e:"🥚",b:"Fresh"},
{id:7,name:"Basmati Rice",cat:"Staples",unit:"5 kg",price:399,old:449,e:"🍚",b:"Deal"},
{id:8,name:"Wheat Atta",cat:"Staples",unit:"5 kg",price:249,old:279,e:"🌾",b:"Popular"},
{id:9,name:"Green Peas",cat:"Vegetables",unit:"500 g",price:69,old:79,e:"🫛",b:"Fresh"},
{id:10,name:"Oranges",cat:"Fruits",unit:"1 kg",price:89,old:109,e:"🍊",b:"Seasonal"},
{id:11,name:"Paneer",cat:"Dairy",unit:"200 g",price:89,old:99,e:"🧀",b:"Fresh"},
{id:12,name:"Toor Dal",cat:"Staples",unit:"1 kg",price:159,old:179,e:"🫘",b:"Value"}];
const categories=[["Fruits","🍎"],["Vegetables","🥦"],["Dairy","🥛"],["Staples","🌾"],["Snacks","🍪"],["Beverages","🧃"]];
let cart=JSON.parse(localStorage.getItem("groceryCart")||"[]"),current="All";
const $=id=>document.getElementById(id);
function categoriesView(){ $("categories").innerHTML=categories.map(x=>'<button class="cat" onclick="filterCat(\''+x[0]+'\')"><i>'+x[1]+'</i><b>'+x[0]+'</b></button>').join("") }
function filtersView(){ $("filters").className="filters"; $("filters").innerHTML=["All","Fruits","Vegetables","Dairy","Staples"].map(x=>'<button class="'+(x===current?"active":"")+'" onclick="filterCat(\''+x+'\')">'+x+'</button>').join("") }
function productsView(list){ $("grid").innerHTML=list.length?list.map(p=>'<article class="product"><div class="pic"><span class="badge">'+p.b+'</span>'+p.e+'</div><div class="body"><h3>'+p.name+'</h3><span class="unit">'+p.unit+'</span><div class="priceRow"><div><b>₹'+p.price+'</b> <del class="unit">₹'+p.old+'</del></div><button class="add" onclick="add('+p.id+')">+ Add</button></div></div></article>').join(""):'<p>No products found.</p>' }
function filterCat(c){current=c;filtersView();productsView(c==="All"?products:products.filter(p=>p.cat===c));document.getElementById("products").scrollIntoView({behavior:"smooth"})}
function add(id){const p=products.find(x=>x.id===id),x=cart.find(x=>x.id===id);x?x.qty++:cart.push({...p,qty:1});save();toast(p.name+" added to cart")}
function qty(id,d){const x=cart.find(x=>x.id===id);if(!x)return;x.qty+=d;if(x.qty<1)cart=cart.filter(x=>x.id!==id);save()}
function save(){localStorage.setItem("groceryCart",JSON.stringify(cart));cartView()}
function cartView(){const n=cart.reduce((a,x)=>a+x.qty,0),t=cart.reduce((a,x)=>a+x.price*x.qty,0);$("count").textContent=n;$("total").textContent="₹"+t.toLocaleString("en-IN");$("items").className="cartItems";$("items").innerHTML=cart.length?cart.map(x=>'<div class="line"><div class="mini">'+x.e+'</div><div><h4>'+x.name+'</h4><small>₹'+x.price+' × '+x.qty+'</small></div><div class="qty"><button onclick="qty('+x.id+',-1)">−</button><b>'+x.qty+'</b><button onclick="qty('+x.id+',1)">+</button></div></div>').join(""):'<p style="text-align:center;color:#777;padding:50px 10px">Your cart is empty.</p>'}
function openCart(){$("cart").classList.add("drawerOpen");$("shade").classList.add("show")}function closeCart(){$("cart").classList.remove("drawerOpen");$("shade").classList.remove("show")}
function toast(s){$("toast").textContent=s;$("toast").classList.add("show");clearTimeout(window.tt);window.tt=setTimeout(()=>$("toast").classList.remove("show"),1800)}
function checkout(){if(!cart.length)return toast("Add products to your cart first");toast("Checkout is ready for the next Firebase/payment step.")}
$("cartBtn").onclick=openCart;$("location").onclick=()=>toast("Delivery location will be connected to delivery zones.");
$("search").oninput=e=>{const q=e.target.value.toLowerCase().trim();current="All";filtersView();productsView(q?products.filter(p=>(p.name+" "+p.cat).toLowerCase().includes(q)):products)};
categoriesView();filtersView();productsView(products);cartView();