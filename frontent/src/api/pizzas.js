import API from  "./axios";


//-------api endpoint for create , update , delete , get ---------pizza 

export const getAllPizzas = (category) => {

    const url = category && category !== 'All' ? `/pizzas?category=${category}` 
    : '/pizzas';
    return API.get(url);
}

export const getPizzaById = (id) => API.get(`/pizzas/${id}`);


export const createPizza = (pizzaData) => API.post('/pizzas', pizzaData);

export const updatePizza = (id, pizzaData) => API.put(`/pizzas/${id}`, pizzaData);

export const deletePizza = (id) => API.delete(`/pizzas/${id}`);


