const LOAD_NUM = 10;

new Vue({
	el: '#app',
	data: {
		total: 0,
		items: [],
		cart: [],
		results: [],
		new_search: 'dragons',
		last_search: '',
		loading: false,
		price: 9.99,
		no_more_items: false,
	},
	computed: {
		noMoreItems: function() {
			return this.results.length === this.items.length && this.results.length > 0;
		}
	},
	methods: {
		appendItems: function() {
			if(this.items.length < this.results.length) {
				var append = this.results.slice(this.items.length,this.items.length + LOAD_NUM);
				this.items = this.items.concat(append);
				for ( var i=0;i < this.items.length > 0;i++) {
					this.items[i].price = this.price;
				}
			}
		},
		onSearch: function() {
			if(this.new_search.length) {
				this.items = [];
				this.loading = true;
				this.$http.get('/search/'.concat(this.new_search))
				.then(function(res){
					this.last_search = this.new_search;
					this.results = res.data;
					this.appendItems();
					this.loading = false;
				})
			.then(function(){

			})
			}
		},
		addItem: function(index) {
			var item = this.items[index];
			var found = false;

			for ( var i=0;i < this.cart.length && this.cart.length> 0;i++) {
				if (this.cart[i].id === item.id) {
					found = true;
					this.cart[i].qty++;
					this.cart[i].sub = this.cart[i].qty * this.cart[i].price;
					this.total = this.total + this.cart[i].price;
					break;
				}
			}
		
			if (!found) {

				this.cart.push({
					id: item.id,
					title: item.title,
					qty: 1,
					price: item.price,
					sub: item.price
				});

				this.total = this.total + item.price;

			}
		},
		inc: function(item) {
			item.qty++;
			item.sub = item.sub + item.price;
			this.total = this.total + item.price;
		},
		dec: function(item,index) {
			item.qty--;
			item.sub = item.sub - item.price;
			this.total = this.total - item.price;
			if(item.qty <= 0) {
				this.cart.splice(index,1);
			}
			
		}
	},
	filters: {
		currency: function(price) {
			return '$'.concat(price.toFixed(2));
		}
	},
	mounted: function() {
		this.onSearch();

		var vueIntance = this;
		var elem = document.getElementById('product-list-bottom');
		var watcher = scrollMonitor.create(elem);
		watcher.enterViewport(function(){
			vueIntance.appendItems();
		});
	}
});
