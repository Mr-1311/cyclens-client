import {observable, action} from 'mobx';

class Store{
    @observable count = 1;

    @action increment() {
        this.count += 1;
    };
    
    @action decrement() {
        this.count -= 1;
    };
};

export default new Store();
