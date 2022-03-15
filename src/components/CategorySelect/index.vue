<template>
  <div>
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="一级分类">
        <el-select v-model="cForm.category1Id" placeholder="请选择" @change="handler1" :disabled="show">
          <el-option v-for="c1 in category1" :key="c1.id" :label="c1.name" :value="c1.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select v-model="cForm.category2Id" placeholder="请选择" @change="handler2" :disabled="show">
          <el-option v-for="c2 in category2" :key="c2.id" :label="c2.name" :value="c2.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select v-model="cForm.category3Id" placeholder="请选择" @change="handler3" :disabled="show">
          <el-option v-for="c3 in category3" :key="c3.id" :label="c3.name" :value="c3.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "CategorySelect",
  props: ['show'],
  data() {
    return {
      category1: [],
      category2: [],
      category3: [],
      cForm: {
        category1Id: '',
        category2Id: '',
        category3Id: '',
      },
    }
  },
  mounted() {
    this.getCategory1()
  },
  methods: {
    async getCategory1() {
      const result = await this.$api.attr.reqCategory1()
      if (result.code === 200) {
        this.category1 = result.data
      }
    },
    async handler1() {
      this.category2 = []
      this.category3 = []
      this.cForm.category2Id = ''
      this.cForm.category3Id = ''
      this.$emit('getCategoryId', this.cForm)
      const result = await this.$api.attr.reqCategory2(this.cForm.category1Id)
      if (result.code === 200) {
        this.category2 = result.data
      }
    },
    async handler2() {
      this.category3 = []
      this.cForm.category3Id = ''
      this.$emit('getCategoryId', this.cForm)
      const result = await this.$api.attr.reqCategory3(this.cForm.category2Id)
      if (result.code === 200) {
        this.category3 = result.data
      }
    },
    handler3() {
      this.$emit('getCategoryId', this.cForm)
    }
  }
}
</script>

<style scoped>

</style>
