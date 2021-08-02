const uuid = require("uuid");
var stock = new Array(10).fill(0).map(() => new Array(10).fill(0));
var tasks = [];

const TASKS_TYPES = {
    PUT_TO_STOCK:'put_to_stock',
    PICK_FROM_STOCK:'pick_from_stock'
}

const stockIndexs = {
    milk: [5,6],
    bread: [1,5],
    salt: [6,5],
    soap: [8,9],
    pasta: [9,2]
}


const getStockState = async (req, res, next) => {
    try {
        let productLocation;
        let productAmount;
        let stockStatus = Object.keys(stockIndexs).map(productName => {
            productLocation = stockIndexs[productName];
            productAmount = stock[productLocation[0]][productLocation[1]];
            return ({ name: productName, amount: productAmount})
        })
        res.send(stockStatus);
    } catch (err) {
        next(err);
    }
};

const getTheNextTasks = async (req, res, next) => {
    try {
        res.send(tasks);
    } catch (err) {
        next(err);
    }
};

const addSupply = async (req, res, next) => {
    try {
        let products = req.data;
        let productLocation;
        //check that all products are in stock
        if(productsValidation(products)) {
            products.forEach(product => {
                productLocation = stockIndexs[product]; 
                createTask(TASKS_TYPES.PUT_TO_STOCK, product, productLocation);
            })
            next();
        } else {
            throw new Error('invalid products');
        }
    } catch (err) {
        next(err);
    }
};

const pickOrder = async (req, res, next) => {
    try {
        let products = req.data;
        let productLocation;
        //Check that all products are in stock
        if(productsValidation(products)) {
            products.forEach(product => {
                productLocation = stockIndexs[product]; 
                //Check if there is enough products in stock
                if (stock[productLocation[0]][productLocation[1]] > 0){
                    createTask(TASKS_TYPES.PICK_FROM_STOCK,product, productLocation);
                } else {
                    throw new Error(`there is not enough supply for: ${product}`)
                }
            })
            next();
        } else {
            throw new Error('invalid products')
        }
    } catch (err) {
        next(err);
    }
};

const completeTask = async (req, res, next) => {
    try {
        const taskId = req.data;
        let currTask = tasks.find(task => task.id === taskId);
        
        if (currTask.action === TASKS_TYPES.PUT_TO_STOCK){
            stock[currTask.location[0]][currTask.location[1]]++;
        }
        if (currTask.action === TASKS_TYPES.PICK_FROM_STOCK){
            if (stock[productLocation[0]][productLocation[1]] > 0){
                stock[currTask.location[0]][currTask.location[1]]--;
            } else {
                throw new Error(`there is not enough supply for: ${product}`)
            }
        }
        tasks = tasks.filter(task => currTask.id == task.id);
        next();
    } catch (err) {
        next(err);
    }
};

const createTask = (action, product, location) => {
    tasks.push({
        id: uuid(),
        action,
        product,
        location,
    })
}

//check that all products are in stock
const productsValidation = (products) => products.every(product => Object.keys(stockIndexs).includes(product))       
module.exports = {completeTask,pickOrder,getTheNextTasks,addSupply, getStockState};
