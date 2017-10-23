<template>
  <div class="m-list-config">
    <div class="m-card">
      <h5 class="u-title">筛选区</h5>
      <div class="f-mb10">
        <el-button size="small" @click="onAddFieldClick">新增按钮</el-button>
      </div>
      <el-table :data="value.filters">
        <el-table-column label="标题">
          <template scope="scope">
            <el-input v-model="scope.row.title" placeholder="请输入筛选项标题"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="属性名">
          <template scope="scope">
            <el-input v-model="scope.row.key" placeholder="请输入筛选项绑定属性名"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="类型">
          <template scope="scope">
            <el-select v-model="scope.row.type" placeholder="请选择筛选项类型"></el-select>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="135" align="center">
          <template scope="scope">
            <el-button v-if="scope.$index > 0" type="text" @click="onUpMoveClick(value.filters, scope.$index)">上移</el-button>
            <el-button v-if="scope.$index < value.filters.length - 1" type="text" @click="onDownMoveClick(value.filters, scope.$index)">下移</el-button>
            <el-button type="text" @click="onDeleteRowClick(value.filters, scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="m-card">
      <h5 class="u-title">其他按钮</h5>
      <div class="f-mb10">
        <el-button size="small" @click="onAddButtonClick">新增按钮</el-button>
      </div>
      <el-table :data="value.buttons">
        <el-table-column label="文字">
          <template scope="scope">
            <el-input v-model="scope.row.title" placeholder="请输入按钮文本"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="绑定事件名">
          <template scope="scope">
            <el-input v-model="scope.row.event" placeholder="请输入Click对应的事件名"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="类型">
          <template scope="scope">
            <el-select v-model="scope.row.type" placeholder="请选择按钮类型"></el-select>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="135" align="center">
          <template scope="scope">
            <el-button v-if="scope.$index > 0" type="text" @click="onUpMoveClick(value.buttons, scope.$index)">上移</el-button>
            <el-button v-if="scope.$index < value.buttons.length - 1" type="text" @click="onDownMoveClick(value.buttons, scope.$index)">下移</el-button>
            <el-button type="text" @click="onDeleteRowClick(value.buttons, scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="m-card">
      <h5 class="u-title">列表项</h5>
      <div class="f-mb10">
        <el-button size="small" @click="onAddColClick">新增列</el-button>
      </div>
      <el-table :data="value.cols">
        <el-table-column label="标题">
          <template scope="scope">
            <el-input v-model="scope.row.title" placeholder="请输入列标题"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="Key">
          <template scope="scope">
            <el-input v-model="scope.row.key" placeholder="请输入Key"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="过滤器">
          <template scope="scope">
            <el-select v-model="scope.row.type" placeholder="请选择过滤器"></el-select>
          </template>
        </el-table-column>
        <el-table-column label="固定列位置" width="200">
          <template scope="scope">
            <el-radio-group v-model="scope.row.fixed">
              <el-radio label="">不固定</el-radio>
              <el-radio label="left">左</el-radio>
              <el-radio label="right">右</el-radio>
            </el-radio-group>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="135" align="center">
          <template scope="scope">
            <el-button v-if="scope.$index > 0" type="text" @click="onUpMoveClick(value.cols, scope.$index)">上移</el-button>
            <el-button v-if="scope.$index < value.cols.length - 1" type="text" @click="onDownMoveClick(value.cols, scope.$index)">下移</el-button>
            <el-button type="text" @click="onDeleteRowClick(value.cols, scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'listConfig',
  props: {
    value: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {};
  },
  methods: {
    onAddFieldClick() {
      this.value.filters.push({
        title: '',
        key: '',
        type: '',
      });
    },
    onAddButtonClick() {
      this.value.buttons.push({
        title: '',
        event: '',
        type: '',
      });
    },
    onAddColClick() {
      this.value.cols.push({
        title: '',
        key: '',
        type: '',
        fixed: ''
      });
    },
    onUpMoveClick(list, currentIndex) {
      if (currentIndex === 0) {
        return;
      }

      list.splice(currentIndex - 1, 2, list[currentIndex], list[currentIndex - 1]);
      this.$forceUpdate();
    },
    onDownMoveClick(list, currentIndex) {
      if (currentIndex === list.length - 1) {
        return;
      }

      list.splice(currentIndex, 2, list[currentIndex + 1], list[currentIndex]);
      this.$forceUpdate();
    },
    onDeleteRowClick(list, index) {
      list.splice(index, 1);
    },
  }
};
</script>

<style scoped>
.m-list-config {
  .u-title {
    margin: 0 0 10px 0;

    &:before {
      content: "";
      display: inline-block;
      position: relative;
      top: 2px;
      background-color: #333;
      width: 3px;
      height: 14px;
      margin-right: 5px;
    }
  }
  .m-card {
    margin: 10px 0;
  }
}
</style>
