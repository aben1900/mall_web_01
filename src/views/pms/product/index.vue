<template>
  <div style="height:100%;width:100%;">
    <el-card class="search-pane-class" style="height:170px;">
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
                  v-for="(statusVal,statusKey) in this.$t('pms.publishStatus')"
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
    <el-card style="height:100%;flex-display:column;">
      <el-table ref="productTable"
                :data="products"
                style="width: 100%"
                @selection-change="handleSelectionChange"
                v-loading="listLoading"
                height="100%"
                border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="编号" width="100" align="center" prop="id"/>
        <el-table-column label="商品图片" width="120" align="center">
          <template slot-scope="scope"><img style="height: 80px" :src="scope.row.pic"></template>
        </el-table-column>
        <el-table-column label="商品名称" align="center">
          <template slot-scope="scope">
            <p>{{ scope.row.name }}</p>
            <p>品牌：{{ scope.row.brandName }}</p>
          </template>
        </el-table-column>
        <el-table-column label="价格/货号" width="120" align="center">
          <template slot-scope="scope">
            <p>价格：￥{{ scope.row.price }}</p>
            <p>货号：{{ scope.row.productSn }}</p>
          </template>
        </el-table-column>
        <el-table-column label="标签" width="140" align="center">
          <template slot-scope="scope">
            <p>上架：
              <el-switch
                  @change="handlePublishStatusChange(scope.$index, scope.row)"
                  :active-value="1"
                  :inactive-value="0"
                  v-model="scope.row.publishStatus">
              </el-switch>
            </p>
            <p>新品：
              <el-switch
                  @change="handleNewStatusChange(scope.$index, scope.row)"
                  :active-value="1"
                  :inactive-value="0"
                  v-model="scope.row.newStatus">
              </el-switch>
            </p>
            <p>推荐：
              <el-switch
                  @change="handleRecommendStatusChange(scope.$index, scope.row)"
                  :active-value="1"
                  :inactive-value="0"
                  v-model="scope.row.recommandStatus">
              </el-switch>
            </p>
          </template>
        </el-table-column>
        <el-table-column label="排序" width="100" align="center" prop="sort">
        </el-table-column>
        <el-table-column label="SKU库存" width="100" align="center">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" @click="showSkuEditDlg(scope.$index, scope.row)"
                       circle></el-button>
          </template>
        </el-table-column>
        <el-table-column label="销量" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.sale }}</template>
        </el-table-column>
        <el-table-column label="审核状态" width="100" align="center">
          <template slot-scope="scope">
            <p>{{ getVerifyStatus(scope.row.verifyStatus) }}</p>
            <p>
              <el-button
                  type="text"
                  @click="showVerifyDetail(scope.$index, scope.row)">审核详情
              </el-button>
            </p>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            layout="total, sizes,prev, pager, next,jumper"
            :page-size="listQuery.pageSize"
            :page-sizes="[5,10,15]"
            :current-page.sync="listQuery.pageNum"
            :total="total">
        </el-pagination>
      </div>
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
      products: null,
      multipleSel: [],
    }
  },
  mounted() {
    this.publishStatusOptions = this.$t('pms.publishStatus')
    console.log('mounted.....')
  },
  created() {
    console.log('created.....')
    this.getProductList()
    this.getBrandList()
    this.getProductCateList()
  },
  methods: {
    getVerifyStatus(verifyStatus) {
      return this.$t('pms.verifyStatus.' + verifyStatus)
    },
    getProductList() {
      this.listLoading = true;
      getProducts(this.listQuery).then(response => {
        this.listLoading = false;
        this.products = response.data.list
        this.total = response.data.total
      })
    },
    getBrandList() {
      getBrands({pageNum: 1, pageSize: 100}).then(response => {
        this.brandOptions = [];
        let brandList = response.data.list;
        for (let i = 0; i < brandList.length; i++) {
          this.brandOptions.push({label: brandList[i].name, value: brandList[i].id});
        }
      })
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
    handleSelectionChange(val) {
      this.multipleSel = val
    },
    ShowVerifyDetail(index, row) {
      console.log("ShowVerifyDetail", row);
    },
    handleSizeChange(val) {
      this.listQuery.pageNum = 1
      this.listQuery.pageSize = val
      this.getProductList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.getProductList()
    },
  }
}
</script>

<style scoped>
.search-pane-class {
  flex-direction: column;
}
.el-card >>> .el-card__body{
  height: calc(100vh - 300px);
}
</style>
