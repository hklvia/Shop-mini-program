// pages/productdetail/productdetail.js
import { request } from '../../request/index.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {

    product:{},
    sku_show:false,
    skus:[],
    proSkus:[],
    skuDisInfo:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {product_id}=options
    this.getProductInfo(product_id)
  },

  async getProductInfo(product_id){

    const resData= await request({
      url:"/product/getfull",
      data:{id:product_id},
      method:"get"
    })
    resData.product.productSlideImgs=JSON.parse(resData.product.productSlideImgs)
    resData.product.productDetail=JSON.parse(resData.product.productDetail)
    resData.product.productSkuValues=JSON.parse(resData.product.productSkuValues)

    let skuDisInfo="请选择 "
    resData.product.productSkuValues.forEach(v=>{
      v.selectedValue=null
      skuDisInfo+=v.name+" "
    })
    
    // resData.skus.forEach(v=>{

    //   v.selectedValue=null
    //   skuDisInfo+=v.attrName+" "

    // })
    
    this.setData({
      product:resData.product,
      skus:resData.skus,
      proSkus:resData.productSkus,
      skuDisInfo:skuDisInfo
    })
    
  },
  showSku(){

    this.setData({sku_show:true})
  },
  onClose() {
    this.setData({ sku_show: false });
    let skuDisInfo=""
    let {product}=this.data
    product.productSkuValues.forEach(v=>{
      if(v.selectedValue!=null){
        skuDisInfo+=v.selectedValue+" "
      }
    })
    if(skuDisInfo!=""){
      this.setData({skuDisInfo:"已选择 "+skuDisInfo})
    }
  },

  handleSkuChange(event){
    const {attrname,attrvalue}=event.currentTarget.dataset
    let {product}=this.data
    product.productSkuValues.forEach(v=>{
      if(v.name==attrname){
        v.selectedValue=attrvalue
      }
    })
    this.setData({product}) 
  }
})