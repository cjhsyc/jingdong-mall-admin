<template>
  <div>
    <el-card style="margin-bottom: 20px">
      <CategorySelect @getCategoryId="getCategoryId" :show="!isShow"/>
    </el-card>
    <el-card>
      <div v-show="isShow">
        <el-button type="primary" icon="el-icon-plus" style="margin-bottom: 20px"
                   :disabled="!cForm.category3Id" @click="addAttr">添加属性
        </el-button>
        <el-table border :data="attrList">
          <el-table-column label="序号" width="80" type="index" align="center"></el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="190"></el-table-column>
          <el-table-column label="属性值列表">
            <template v-slot="{row}">
              <el-tag v-for="attr in row.attrValueList" :key="attr.id" style="margin-right: 15px">
                {{ attr.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="190">
            <template v-slot="{row}">
              <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateAttr(row)"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="!isShow">
        <el-form :inline="true" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input placeholder="请输入属性名" v-model="attrInfo.attrName"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-plus" @click="addAttrValue" :disabled="!attrInfo.attrName">
          添加属性值
        </el-button>
        <el-button @click="isShow=true">取消</el-button>
        <el-table border style="margin: 20px 0" :data="attrInfo.attrValueList">
          <el-table-column type="index" label="序号" align="center" width="80"></el-table-column>
          <el-table-column label="属性值名称">
            <template v-slot="{row,$index}">
              <el-input placeholder="请输入属性值名称" v-model="row.valueName" size="mini" v-if="row.flag"
                        @blur="toLook(row)" @keyup.native.enter="toLook(row)" :ref="$index"></el-input>
              <span v-else @click="toEdit(row,$index)" style="display: block">{{ row.valueName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="250">
            <template v-slot="{row,$index}">
              <el-popconfirm :title="`确定删除${row.valueName}吗？`" @onConfirm="deleteAttrValue($index)">
                <el-button type="danger" icon="el-icon-delete" size="mini" slot="reference"></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" :disabled="!attrInfo.attrValueList.length" @click="AddOrUpdateAttr">保存</el-button>
        <el-button @click="isShow=true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import CategorySelect from '@/components/CategorySelect'

export default {
  name: "Attr",
  components: {
    CategorySelect
  },
  data() {
    return {
      cForm: {
        category1Id: '',
        category2Id: '',
        category3Id: '',
      },
      attrList: [],
      isShow: true,
      attrInfo: {
        attrName: '',
        attrValueList: [
          /*{
            attrId: 0,
            valueName: ''
          },*/
        ],
        categoryId: 0,//三级分类id
        categoryLevel: 3,
      },
    }
  },
  methods: {
    getCategoryId(cForm) {
      this.cForm = cForm
      if (this.cForm.category3Id) {
        this.getAttrList()
      }
    },
    async getAttrList() {
      const {category1Id, category2Id, category3Id} = this.cForm
      const result = await this.$api.attr.reqAttrList(category1Id, category2Id, category3Id)
      if (result.code === 200) {
        this.attrList = result.data
      }
    },
    addAttr() {
      this.isShow = false
      this.attrInfo = {
        attrName: '',
        attrValueList: [],
        categoryId: this.cForm.category3Id,
        categoryLevel: 3,
      }
    },
    updateAttr(row) {
      this.attrInfo = JSON.parse(JSON.stringify(row))
      this.attrInfo.attrValueList.forEach(value => {
        // value.flag = false//不是响应式数据
        this.$set(value, 'flag', false)
      })
      this.isShow = false
    },
    addAttrValue() {
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id,
        valueName: '',
        flag: true
      })
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus()
      })
    },
    toLook(row) {
      if (row.valueName.trim() === '') {
        this.$message.error('输入不能为空!')
        return
      }
      if (this.attrInfo.attrValueList.some(value => {
        if (row !== value) {
          return value.valueName === row.valueName
        }
      })) {
        this.$message.error('已有该属性!')
        return
      }
      row.flag = false
    },
    toEdit(row, index) {
      row.flag = true
      this.$nextTick(() => {
        this.$refs[index].focus()
      })
    },
    deleteAttrValue(index) {
      this.attrInfo.attrValueList.splice(index, 1)
    },
    async AddOrUpdateAttr() {
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(value => {
        if (value.valueName.trim() !== '') {
          delete value.flag
          return true
        }
      })
      const result = await this.$api.attr.reqAddOrUpdateAttr(this.attrInfo)
      if (result.code === 200) {
        this.$message.success('保存成功！')
        this.getAttrList()
        this.isShow = true
      }
    }
  }
}
</script>

<style scoped>

</style>
