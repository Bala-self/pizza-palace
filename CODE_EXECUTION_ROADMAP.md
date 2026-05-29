# 🍕 Pizza Palace - Code Execution Roadmap

## **STEP 0: APP STARTUP**

### Browser loads `http://localhost:5173`

```
1. index.html loads
   ↓
2. main.jsx runs
   import App from './App.jsx'
   React renders <App /> into #root
   ↓
3. App.jsx wraps everything:
   <AuthProvider>
     <CartProvider>
       <BrowserRouter>
         <Routes>
   ↓
4. AuthContext initializes:
   - Checks localStorage for "token"
   - If token exists → calls GET /api/auth/profile
   - Sets user state if valid
   - Sets loading = false
   ↓
5. CartContext initializes:
   - Reads localStorage "cart" 
   - Sets items = [] or saved items
   ↓
6. Router decides which page to show:
   - If no path → defaults to "/"
   - "/" requires auth → redirects to "/auth" if not logged in
   ↓
7. User sees Login/Register page
```

---

## **STEP 1: USER REGISTERS**

### User clicks "Register" tab and fills form

**Frontend (React):**
```
1. Auth.jsx form shows:
   - Name input
   - Email input
   - Password input
   - Register button
   
2. User fills and clicks "Register"
   
3. handleRegister() function runs:
   const { data } = await registerUser({
     name: "John",
     email: "john@gmail.com",
     password: "password123"
   });
   
4. registerUser() calls:
   axios.post('/api/auth/register', {...})
   
5. axios adds JWT token header (if exists)
   - Sends to: http://localhost:3000/api/auth/register
   - Sends: { name, email, password }
```

**Backend (Express):**
```
6. server.js receives POST request
   app.use("/api/auth", authRoutes)
   ↓
7. authRoutes.js routes to:
   router.post('/register', validateRequest, register)
   
8. validateRequest middleware validates:
   - name: not empty
   - email: valid format
   - password: min 8 chars
   
9. authController.register() executes:
   
   a) Check validation errors
      if (!errors.isEmpty()) return error response
   
   b) Extract { name, email, password } from req.body
   
   c) Query MongoDB:
      existingUser = await User.findOne({ email })
      if (existingUser) return "Email already exists"
   
   d) Hash password:
      hashedPassword = await bcrypt.hash(password, 12)
      (converts "password123" → "$2a$12$xyz...")
   
   e) Create new user in MongoDB:
      user = await User.create({
        name: "John",
        email: "john@gmail.com",
        password: hashedPassword,
        role: "customer"  ← default
      })
   
   f) Generate JWT token:
      token = generateToken(user)
      // Inside: jwt.sign({ id: user._id }, SECRET, {expiresIn: '7d'})
   
   g) Send response:
      res.status(201).json({
        success: true,
        token: "eyJhbGc...",
        user: { id, name, email, role }
      })
```

**Frontend receives response:**
```
10. AuthContext.register() function:
    
    a) Got { token, user }
    
    b) Save token to localStorage:
       localStorage.setItem("token", token)
    
    c) Update user state:
       setUser(user)  ← Re-render with user data
    
    d) Return user object
    
11. Auth.jsx gets user back:
    - Shows toast: "Registered successfully!"
    - Redirects to "/"
    
12. "/" is protected route:
    - Checks if user exists (✅ yes)
    - Renders Home.jsx
```

---

## **STEP 2: USER LOGS IN**

### User types email & password on login page

**Frontend:**
```
1. Auth.jsx login form:
   handleLogin(email, password)
   
2. Calls:
   const { data } = await loginUser({
     email: "john@gmail.com",
     password: "password123"
   })
   
3. axios.post('/api/auth/login', {email, password})
```

**Backend:**
```
4. authController.login() runs:
   
   a) Extract { email, password }
   
   b) Find user in MongoDB:
      user = await User.findOne({ email })
      if (!user) return "Invalid email or password"
   
   c) Compare passwords:
      passwordMatches = await bcrypt.compare(
        password,  // "password123"
        user.password  // hashed in DB
      )
      if (!passwordMatches) return error
   
   d) Generate token (same as register):
      token = generateToken(user)
   
   e) Send back:
      res.json({
        success: true,
        token,
        user: { id, name, email, role }
      })
```

**Frontend:**
```
5. AuthContext.login() saves token + user
   
6. Redirects to "/"
   
7. Home.jsx renders welcome page
```

---

## **STEP 3: USER BROWSES PIZZAS (/menu)**

### User clicks "Menu" in navbar or navigates to /menu

**Frontend (React Router):**
```
1. Navbar has links:
   <Link to="/menu">Menu</Link>
   
2. User clicks → URL changes to /menu
   
3. Router matches route:
   <Route path="/menu" element={<Menu />} />
   
4. Menu.jsx renders
```

**Menu.jsx executes:**
```
5. useEffect(() => {
     fetchPizzas()  // Runs on mount
   }, [])
   
6. fetchPizzas() calls:
   const { data } = await getPizzas()
   
7. axios.get('/api/pizzas')
   // Token auto-added from axios interceptor
```

**Backend:**
```
8. pizzaRoutes.js:
   router.get('/', getAllPizzas)
   
9. authMiddleware runs first:
   - Extracts token from headers
   - Verifies JWT signature
   - Sets req.user = decoded token data
   - Passes control to getAllPizzas
   
10. pizzaController.getAllPizzas():
    
    a) Check if user is admin:
       isAdmin = req.user && req.user.role === 'admin'
    
    b) Build filter object:
       filter = {}
       if (!isAdmin) filter.isAvailable = true
       // Non-admins only see available pizzas
    
    c) Check query params:
       if (req.query.category === 'Veg')
         filter.category = 'Veg'
    
    d) Query MongoDB:
       pizzas = await Pizza.find(filter).sort('-createdAt')
       // Returns newest pizzas first
    
    e) Send response:
       res.json({
         success: true,
         count: 10,
         pizzas: [...]
       })
```

**Frontend:**
```
11. Menu.jsx receives pizzas data:
    setPizzas(data.pizzas)
    
12. Renders PizzaCard for each pizza:
    {pizzas.map(pizza => (
      <PizzaCard key={pizza._id} pizza={pizza} />
    ))}
    
13. User sees pizza grid with:
    - Image, name, price, category
    - "View Details" button
```

---

## **STEP 4: USER VIEWS PIZZA DETAILS (/pizza/:id)**

### User clicks pizza card → goes to detail page

**Frontend:**
```
1. PizzaCard.jsx has:
   <Link to={`/pizza/${pizza._id}`}>
     View Details
   </Link>
   
2. URL changes to: /pizza/507f1f77bcf86cd799439011
   
3. Router matches:
   <Route path="/pizza/:id" element={<PizzaDetail />} />
   
4. PizzaDetail.jsx mounts:
   useEffect(() => {
     const id = useParams().id
     fetchPizza(id)
   }, [id])
   
5. axios.get(`/api/pizzas/${id}`)
```

**Backend:**
```
6. pizzaRoutes.js:
   router.get('/:id', getPizzaById)
   
7. pizzaController.getPizzaById():
   
   a) Extract ID from params:
      id = req.params.id  // "507f1f77bcf86cd799439011"
   
   b) Query MongoDB:
      pizza = await Pizza.findById(id)
      if (!pizza) return "Pizza not found"
   
   c) Send response:
      res.json({
        success: true,
        pizza: {...full pizza object...}
      })
```

**Frontend:**
```
8. PizzaDetail.jsx receives pizza:
   setPizza(data.pizza)
   
9. Renders full details:
   - Large image
   - Name, description, price
   - Category badge
   - "Add to Cart" button with quantity selector
```

---

## **STEP 5: USER ADDS TO CART**

### User selects quantity and clicks "Add to Cart"

**Frontend (NO BACKEND CALL):**
```
1. PizzaDetail.jsx has button:
   onClick={() => addToCart(pizza, qty)}
   
2. addToCart comes from CartContext.addToCart()
   
3. CartContext.addToCart(pizza, qty):
   
   a) Check if pizza already in cart:
      existing = items.find(item => item.pizza._id === pizza._id)
   
   b) If exists, increase quantity:
      items.map(item => 
        item.pizza._id === pizza._id
          ? { ...item, qty: item.qty + qty }  // 1+2=3
          : item
      )
   
   c) If new, add to cart:
      [...items, { pizza, qty }]
   
   d) setItems(newArray)
   
4. useEffect watches items state:
   useEffect(() => {
     localStorage.setItem('cart', JSON.stringify(items))
   }, [items])
   
5. Cart saved to localStorage:
   localStorage['cart'] = '[{"pizza":{...}, "qty":2}]'
   
6. Toast shows: "Added to cart!"
   
7. Navbar cart count updates instantly
   (cartCount = items.reduce((total, item) => total + item.qty, 0))
```

---

## **STEP 6: USER GOES TO CART (/cart)**

### User clicks "Cart" in navbar

**Frontend:**
```
1. Navbar:
   <Link to="/cart">Cart ({cartCount})</Link>
   
2. URL → /cart
   
3. Router:
   <Route path="/cart" 
     element={<ProtectedRoute><Cart /></ProtectedRoute>} />
   
4. ProtectedRoute checks:
   - Is user logged in? (req.user exists?)
   - Is route admin-only? No
   - ✅ Allow access
   
5. Cart.jsx renders:
   
   a) Get data from CartContext:
      const { items, updateQty, removeItem, cartTotal } = useCart()
   
   b) Display each item:
      {items.map(item => (
        <div>
          {item.pizza.name}
          Qty: <input onChange={(e) => 
            updateQty(item.pizza._id, e.target.value)
          } />
          Price: {item.pizza.price * item.qty}
          <button onClick={() => removeItem(item.pizza._id)}>
            Remove
          </button>
        </div>
      ))}
   
   c) Show cart total:
      Total: Rs. {cartTotal}
   
   d) Show checkout button:
      <Link to="/checkout">Proceed to Checkout</Link>
```

---

## **STEP 7: USER CHECKS OUT (/checkout)**

### User clicks "Proceed to Checkout"

**Frontend:**
```
1. Checkout.jsx renders:
   
   a) Show order summary:
      - List items in cart
      - Show total price
   
   b) Form for delivery address:
      <input 
        placeholder="Enter delivery address"
        onChange={(e) => setAddress(e.target.value)}
      />
   
   c) Place Order button:
      onClick={handlePlaceOrder}
      
2. handlePlaceOrder():
   
   a) Validate:
      if (!address) return toast("Address required")
      if (items.length === 0) return toast("Cart empty")
   
   b) Prepare order data:
      orderData = {
        items: [
          { pizzaId: "507f1f77bcf86cd799439011", qty: 2 },
          { pizzaId: "507f1f77bcf86cd799439012", qty: 1 }
        ],
        deliveryAddress: "123 Main St"
      }
   
   c) Send to backend:
      const { data } = await axios.post(
        '/api/orders',
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
```

**Backend:**
```
3. orderRoutes.js:
   router.post('/', authMiddleware, placeOrder)
   
4. authMiddleware verifies JWT token
   
5. orderController.placeOrder():
   
   a) Extract data:
      items = req.body.items
      deliveryAddress = req.body.deliveryAddress
   
   b) Validate cart not empty:
      if (!items || items.length === 0)
        return error "Cart is empty"
   
   c) Validate address provided:
      if (!deliveryAddress || deliveryAddress.trim() === '')
        return error "Please provide address"
   
   d) For EACH item in cart:
      for (const item of items) {
        
        // Find pizza in DB
        pizza = await Pizza.findById(item.pizzaId)
        if (!pizza) return error "Pizza not found"
        
        // Check availability
        if (!pizza.isAvailable)
          return error "Pizza unavailable"
        
        // Add to order items
        orderItems.push({
          pizza: pizza._id,
          qty: item.qty,
          price: pizza.price,
          name: pizza.name
        })
        
        // Calculate total
        totalAmount += pizza.price * item.qty
      }
   
   e) Create order in MongoDB:
      order = await Order.create({
        customerId: req.user.id,  // Logged-in user
        items: orderItems,
        totalAmount: totalAmount,
        deliveryAddress: deliveryAddress,
        status: 'Pending'
      })
   
   f) Send response:
      res.status(201).json({
        success: true,
        message: "Order placed successfully!",
        order: {...order data...}
      })
```

**Frontend:**
```
6. Checkout.jsx receives order:
   
   a) Clear cart:
      clearCart()  // Removes from localStorage
   
   b) Show success toast:
      toast.success("Order placed! Redirecting...")
   
   c) Redirect to orders page:
      navigate('/orders')
```

---

## **STEP 8: USER VIEWS ORDER HISTORY (/orders)**

### User navigates to order history

**Frontend:**
```
1. Navbar link:
   <Link to="/orders">My Orders</Link>
   
2. OrderHistory.jsx:
   useEffect(() => {
     getMyOrders()
   }, [])
   
3. axios.get('/api/orders')
   // Only returns CURRENT USER's orders (via token)
```

**Backend:**
```
4. orderRoutes.js:
   router.get('/', authMiddleware, getMyOrders)
   
5. orderController.getMyOrders():
   
   a) Filter orders for current user:
      orders = await Order.find({
        customerId: req.user.id  // From JWT
      }).sort('-createdAt')  // Newest first
   
   b) Send response:
      res.json({
        success: true,
        count: 3,
        orders: [...]
      })
```

**Frontend:**
```
6. OrderHistory.jsx renders orders:
   {orders.map(order => (
     <div>
       <p>Order #: {order._id}</p>
       <p>Date: {order.createdAt}</p>
       <p>Total: Rs. {order.totalAmount}</p>
       <StatusBadge status={order.status} />
       {order.items.map(item => (
         <p>{item.name} x {item.qty}</p>
       ))}
     </div>
   ))}
```

---

## **STEP 9: ADMIN VIEWS ALL ORDERS (/admin/orders)**

### Admin logs in and goes to admin dashboard

**Frontend:**
```
1. Admin user has:
   user = { id, name, email, role: "admin" }
   (from login response)
   
2. Navbar shows admin links:
   <Link to="/admin">Admin</Link>
   
3. Admin clicks → /admin/orders
   
4. ProtectedRoute checks:
   - Is logged in? ✅
   - Is adminOnly={true}? ✅
   - Is user.role === 'admin'? ✅
   - Allow access ✅
   
5. AdminOrders.jsx:
   useEffect(() => {
     getAllOrders()
   }, [])
   
6. axios.get('/api/orders')
   // BUT admin can see ALL orders
```

**Backend:**
```
7. authMiddleware verifies JWT
   req.user.role = "admin"
   
8. orderController.getAllOrders():
   
   a) Query ALL orders (no filter):
      orders = await Order.find()
        .populate('customerId', 'name email')
        // Replaces customerId with actual user data
        .sort('-createdAt')
   
   b) Send response:
      res.json({
        success: true,
        count: 25,
        orders: [...]
      })
```

**Frontend:**
```
9. AdminOrders.jsx displays all orders:
   {orders.map(order => (
     <div>
       <p>Customer: {order.customerId.name}</p>
       <p>Email: {order.customerId.email}</p>
       <StatusBadge status={order.status} />
       <select onChange={(e) => updateStatus(order._id, e.target.value)}>
         <option>Pending</option>
         <option>Confirmed</option>
         <option>Preparing</option>
         <option>Out for Delivery</option>
         <option>Delivered</option>
       </select>
     </div>
   ))}
```

---

## **STEP 10: ADMIN UPDATES ORDER STATUS**

### Admin selects new status from dropdown

**Frontend:**
```
1. updateStatus(orderId, newStatus):
   
   a) Send request:
      axios.put(`/api/orders/${orderId}`, {
        status: newStatus  // "Confirmed"
      })
```

**Backend:**
```
2. orderRoutes.js:
   router.put('/:id', authMiddleware, updateOrderStatus)
   
3. orderController.updateOrderStatus():
   
   a) Extract data:
      status = req.body.status
      orderId = req.params.id
   
   b) Validate status:
      validStatuses = ['Pending', 'Confirmed', 'Preparing', ...]
      if (!validStatuses.includes(status))
        return error "Invalid status"
   
   c) Update in MongoDB:
      order = await Order.findByIdAndUpdate(
        orderId,
        { status: status },
        { new: true }  // Return updated document
      )
   
   d) Send response:
      res.json({
        success: true,
        message: "Order status updated to Confirmed",
        order: {...updated order...}
      })
```

**Frontend:**
```
4. AdminOrders.jsx receives response
   
5. Update local state:
   orders = orders.map(o => 
     o._id === orderId ? {...o, status: newStatus} : o
   )
   
6. Status badge changes color instantly
   
7. Toast: "Order status updated!"
```

---

## **STEP 11: ADMIN CREATES PIZZA (/admin/pizzas)**

### Admin fills form and creates new pizza

**Frontend:**
```
1. AdminPizzas.jsx form inputs:
   name, description, price, category, imageUrl, isAvailable
   
2. handleCreatePizza():
   
   a) Validate form:
      if (!name) return error
      if (price < 0) return error
   
   b) Send data:
      axios.post('/api/pizzas', {
        name: "Margherita",
        description: "Classic cheese pizza",
        price: 299,
        category: "Veg",
        imageUrl: "https://...",
        isAvailable: true
      })
```

**Backend:**
```
3. pizzaRoutes.js:
   router.post('/', authMiddleware, validatePizza, createPizza)
   
4. validatePizza middleware checks:
   - name: required
   - price: required, min 0
   - category: must be "Veg" | "Non-Veg" | "Specialty"
   
5. authMiddleware verifies admin role
   
6. pizzaController.createPizza():
   
   a) Get data from request:
      req.body = {name, description, price, ...}
   
   b) Create in MongoDB:
      pizza = await Pizza.create(req.body)
   
   c) MongoDB auto-adds:
      - _id (unique ID)
      - createdAt, updatedAt (timestamps)
   
   d) Send response:
      res.status(201).json({
        success: true,
        message: "Pizza created successfully",
        pizza: {...}
      })
```

**Frontend:**
```
7. AdminPizzas.jsx receives new pizza:
   
   a) Add to list:
      pizzas.push(newPizza)
   
   b) Clear form
   
   c) Show success toast
   
   d) Pizza appears in list immediately
```

---

## **STEP 12: DATA FLOW SUMMARY**

```
USER INTERACTION
     ↓
FRONTEND (React)
 • Captures input
 • Makes API call with axios
 • axios adds JWT token header
     ↓
NETWORK
 • HTTP request sent to backend
     ↓
BACKEND (Express)
 • Receives request
 • authMiddleware verifies token
 • Route matches
 • Controller executes business logic
 • MongoDB query/write
 • Sends JSON response
     ↓
NETWORK
 • JSON response sent back
     ↓
FRONTEND (React)
 • Receives response
 • Updates state
 • Re-renders component
 • Shows toast/feedback
     ↓
USER SEES UPDATED UI
```

---

## **STEP 13: ERROR HANDLING FLOW**

### If something goes wrong...

**Example: User provides invalid password**

```
Frontend (Auth.jsx):
  handleLogin(email, password)
  → axios.post('/api/auth/login', {...})

Network sends to backend

Backend (authController.login()):
  passwordMatches = await bcrypt.compare(password, user.password)
  if (!passwordMatches) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    })
  }

Frontend receives error:
  .catch(error => {
    toast.error(error.response.data.message)
    // Shows: "Invalid email or password"
  })

User sees error message in red toast
```

---

## **KEY POINTS**

1. **Frontend ← → Backend via HTTP**
   - All communication through REST API endpoints
   - Every call includes JWT token in headers

2. **Database**
   - MongoDB stores all data (Users, Pizzas, Orders)
   - Mongoose validates data before saving

3. **Authentication**
   - JWT token stores user ID + role
   - Every protected route checks token

4. **State Management**
   - AuthContext: User login state
   - CartContext: Shopping cart (localStorage)
   - Component State: Form inputs, loading states

5. **Security**
   - Passwords hashed with bcryptjs (never stored plain)
   - JWT prevents unauthorized access
   - Admin routes blocked if role !== 'admin'

---

## **FLOW DIAGRAM**

```
┌─────────────────────────────────────────────────────────┐
│                    BROWSER (Frontend)                    │
│  ┌────────────────┐  ┌────────────────┐  ┌───────────┐  │
│  │ Auth Pages     │  │ Menu/Cart      │  │   Admin   │  │
│  │ Login/Register │  │ View/Add Items │  │  Pages    │  │
│  └────────────────┘  └────────────────┘  └───────────┘  │
│         ↓                    ↓                    ↓       │
│  ┌──────────────────────────────────────────────────┐   │
│  │   React Router (Navigation)                      │   │
│  └──────────────────────────────────────────────────┘   │
│         ↓                    ↓                    ↓       │
│  ┌──────────────────────────────────────────────────┐   │
│  │   Context API (State Management)                │   │
│  │   • AuthContext (user, login, logout)           │   │
│  │   • CartContext (cart, addToCart, etc)          │   │
│  └──────────────────────────────────────────────────┘   │
│         ↓                    ↓                    ↓       │
│  ┌──────────────────────────────────────────────────┐   │
│  │   Axios (HTTP Client)                            │   │
│  │   • Adds JWT token to all requests               │   │
│  │   • Handles responses/errors                     │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                         ↓↑
                    HTTP/HTTPS
                         ↓↑
┌─────────────────────────────────────────────────────────┐
│                   SERVER (Backend)                       │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Express.js (Web Framework)                      │   │
│  │  • app.listen(3000)                              │   │
│  │  • CORS enabled for localhost:5173               │   │
│  └──────────────────────────────────────────────────┘   │
│         ↓                    ↓                    ↓       │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Middleware                                      │   │
│  │  • authMiddleware (verify JWT)                   │   │
│  │  • errorHandler (catch errors)                   │   │
│  │  • CORS, helmet (security)                       │   │
│  └──────────────────────────────────────────────────┘   │
│         ↓                    ↓                    ↓       │
│  ┌────────────────┐  ┌────────────────┐  ┌───────────┐  │
│  │   Routes       │  │ Controllers    │  │ Models    │  │
│  │ /auth          │  │ authController │  │ User      │  │
│  │ /pizzas        │  │ pizzaCtrl      │  │ Pizza     │  │
│  │ /orders        │  │ orderCtrl      │  │ Order     │  │
│  └────────────────┘  └────────────────┘  └───────────┘  │
│         ↓                    ↓                    ↓       │
│  ┌──────────────────────────────────────────────────┐   │
│  │  MongoDB (Database)                              │   │
│  │  • users collection                              │   │
│  │  • pizzas collection                             │   │
│  │  • orders collection                             │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

This is the **complete execution roadmap**! Every user action follows these steps.
