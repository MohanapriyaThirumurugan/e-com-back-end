
class APIFeatures {
    constructor(query, queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }
// for search using keyword
    search(){
       let keyword =  this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword, //find the qureystring in monogodb schema
                $options: 'i' //case sensitive
            }
       }: {};

       this.query.find({...keyword})
       return this;
    }

// this is for filter the like price wise
    filter(){
        const queryStrCopy = { ...this.queryStr };
  
        //removing fields from query
        const removeFields = ['keyword', 'limit', 'page'];
        removeFields.forEach( field => delete queryStrCopy[field]);
        
        let queryStr = JSON.stringify(queryStrCopy);
        queryStr =  queryStr.replace(/\b(gt|gte|lt|lte)/g, match => `$${match}`)

        this.query.find(JSON.parse(queryStr));

        return this;
    }
  // this is paginate how many product to show the page
    paginate(resPerPage){
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = resPerPage * (currentPage - 1)
        this.query.limit(resPerPage).skip(skip);
        return this;
    }
}

export default APIFeatures;
// class APIFeatures {
//     constructor(query, queryStr) {
//         this.query = query;
//         this.queryStr = queryStr;
//     }

//     // Search by keyword in product name
//     search() {
//         const keyword = this.queryStr.keyword ? {
//             name: {
//                 $regex: this.queryStr.keyword,
//                 $options: 'i'
//             }
//         } : {};

//         this.query = this.query.find({ ...keyword });
//         return this;
//     }

//     // Filter by price range
//     filterByPrice() {
//         if (this.queryStr.price) {
//             const priceRange = this.queryStr.price.split('-');
//             this.query = this.query.find({
//                 price: { $gte: priceRange[0], $lte: priceRange[1] }
//             });
//         }
//         return this;
//     }

//     // Filter by category
//     filterByCategory() {
//         if (this.queryStr.category) {
//             this.query = this.query.find({ category: this.queryStr.category });
//         }
//         return this;
//     }

//     // Pagination
//     paginate(resPerPage) {
//         const currentPage = Number(this.queryStr.page) || 1;
//         const skip = resPerPage * (currentPage - 1);
//         this.query = this.query.limit(resPerPage).skip(skip);
//         return this;
//     }
// }

// export default APIFeatures;
