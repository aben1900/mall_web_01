<template>
  <div style="height:100%;width:100%;">
    <el-card class="search-pane-class">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button>重置</el-button>
        <el-button>查询</el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="输入搜索：">
            <el-input style="width: 200px" v-model="listQuery.keyword" placeholder="商品名称"></el-input>
          </el-form-item>
          <el-form-item label="商品货号：">
            <el-input style="width: 200px" v-model="listQuery.productSn" placeholder="商品货号"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-cascader clearable expand-trigger="hover"
                         v-model="cateValue"
                         :options="cateOptions">
            </el-cascader>
          </el-form-item>
          <el-form-item label="请选择品牌">
            <el-select v-model="listQuery.brandId" placeholder="请选择品牌" clearable>
              <el-option
                  v-for="item in brandOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="上架状态：">
            <el-select v-model="listQuery.publishStatus" placeholder="全部" clearable>
              <el-option
                  v-for="(statusVal,statusKey) in publishStatusOptions"
                  :key="statusKey"
                  :label="statusVal"
                  :value="statusVal">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="审核状态：">
            <el-select v-model="listQuery.verifyStatus" placeholder="全部" clearable>
              <el-option
                  v-for="(statusVal,statusKey) in this.$t('pms.verifyStatus')"
                  :key="statusKey"
                  :label="statusVal"
                  :value="statusVal">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card>

    </el-card>
  </div>
</template>

<script>
import {getProducts,} from '@/api/pms/product'
import {getBrands} from '@/api/pms/brand'
import {getProductCatesWithChildren} from '@/api/pms/productCate'

// import {getSkuStocks, updateSkuStock} from '@/api/pms/skuStock'

const defaultListQuery = {
  keyword: null,
  pageNum: 1,
  pageSize: 5,
  publishStatus: null,
  verifyStatus: null,
  productSn: null,
  productCategoryId: null,
  brandId: null
}
export default {
  name: "productList",
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      cateValue: [],
      cateOptions: null,
      brandOptions: [],
      publishStatusOptions: [],
      verifyStatusOptions: [],
      listLoading: false,
      products: null
    }
  },
  mounted() {
    this.publishStatusOptions = this.$t('pms.publishStatus')
    console.log('mounted.....')
    console.log(this.publishStatusOptions)
  },
  created() {
    console.log('created.....')
    this.getProductList();
    this.getBrandList();
    this.getProductCateList();
  },
  methods: {
    getProductList() {
      this.listLoading = true;
      getProducts(this.listQuery).then(response => {
        this.listLoading = false;
        this.products = response.data.list;
        this.total = response.data.total;
      });
    },
    getBrandList() {
      getBrands({pageNum: 1, pageSize: 100}).then(response => {
        this.brandOptions = [];
        let brandList = response.data.list;
        for (let i = 0; i < brandList.length; i++) {
          this.brandOptions.push({label: brandList[i].name, value: brandList[i].id});
        }
      });
    },
    getProductCateList() {
      let that = this
      getProductCatesWithChildren().then(response => {
        let list = response.data
        this.cateOptions = []
        for (let i = 0; i < list.length; i++) {
          let children = [];
          if (list[i].children != null && list[i].children.length > 0) {
            for (let j = 0; j < list[i].children.length; j++) {
              children.push({label: list[i].children[j].name, value: list[i].children[j].id})
            }
          }
          that.cateOptions.push({label: list[i].name, value: list[i].id, children: children})
        }
      })
    },
  }
}
</script>

<style scoped>
.search-pane-class {
  flex-direction: column;
}
</style>
