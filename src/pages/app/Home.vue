<template>
  <div>
    <el-row :gutter="20">
      <h2 class="g-section__content__title">最近项目</h2>
      <el-col v-for="item in list" :key="item.id || +new Date()" :sm="12" :md="8" :lg="6">
        <el-card :body-style="cardStyle" class="f-mb20">
          <div slot="header">
            <div class="f-tac">
              <h3 class="f-mb10">项目名称</h3>
              <span>2017-1-1</span>
            </div>
          </div>
          <el-button type="text" icon="edit" @click="onEditClick"></el-button>
          <el-button type="text" icon="setting" @click="onSettingClick"></el-button>
          <el-button type="text" icon="delete" @click="onDeleteClick"></el-button>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  computed: {
    cardStyle() {
      return {
        padding: '5px 50px',
        display: 'flex',
        justifyContent: 'space-around',
        background: '#f2f2f2'
      };
    }
  },
  data() {
    return {
      list: []
    };
  },
  methods: {
    onEditClick() {
      this.$router.push({
        name: 'editor',
        query: {
          id: 1
        }
      });
    },
    onSettingClick() {
      this.$router.push({
        name: 'projectSetting',
        query: {
          id: 1
        }
      });
    },
    onDeleteClick() {
      this.$confirm('确认要删除项目？', '删除项目');
    }
  }
};
</script>

<style scoped>
</style>
