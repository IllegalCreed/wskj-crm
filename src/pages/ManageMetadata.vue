<template>
<div class="root-container">
  <Menu theme="light" ref="menu" :active-name="currentPage" @on-select="selectChanged">
    <MenuGroup title="分类列表">
      <MenuItem :key="item.id" :name="item.id" v-for="(item, index) in catalog">
        {{item.name}}
      </MenuItem>
    </MenuGroup>
  </Menu>
  <div class="main-container">
    <div class="tool-container">
      <Button type="primary" shape="circle" icon="plus-round" @click="createData">新建数据</Button>
      <!-- <Button type="primary" shape="circle" icon="checkmark-round">保存</Button> -->
    </div>
    <div class="content-container">
      <div class="data-item" v-for="(item, index) in currentCatalog.children">
        <p style="width:200px">{{item.name}}</p>
        <Button type="error" shape="circle" icon="close-round" size="small" style="margin-left:50px" @click="deleteData(item.id)"></Button>
      </div>
    </div>
  </div>
  <Modal
    v-model="isShowNewDataModal"
    title="新建数据"
    @on-ok="ok"
    @on-cancel="cancel">
    <Select v-model="currentSelectCatalogId" placeholder="选择分类" style="width:200px">
        <Option v-for="item in catalog" :value="item.id" :key="item.id">{{ item.name }}</Option>
    </Select>
    <Input v-model="newData" placeholder="请输入" style="width: 200px;margin-left: 20px"></Input>
  </Modal>
</div>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
export default {
  data() {
    return {
      isShowNewDataModal: false,
      currentSelectCatalogId: 1,
      newData: "",
      currentPage: 1,
      currentCatalog: { children: [] }
    };
  },
  mounted() {
    this.getMetadataList().then(() => {
      this.currentCatalog = this.catalog.find(item => {
        return item.id == this.currentPage;
      });
      this.$nextTick(function() {
        this.$refs.menu.updateActiveName();
      });
    });
  },
  computed: {
    ...mapState({
      catalog: state => state.metadata.metadata
    })
  },
  methods: {
    ...mapActions({
      getMetadataList: "getMetadataList",
      addMetadata: "addMetadata",
      delMetadata: "delMetadata"
    }),
    selectChanged(id) {
      this.currentPage = id;
      this.currentSelectCatalogId = id;
      this.currentCatalog = this.catalog.find(item => {
        return item.id == id;
      });
    },
    createData() {
      this.isShowNewDataModal = true;
      this.newData = "";
    },
    ok() {
      this.addMetadata({
        name: this.newData,
        type: this.currentSelectCatalogId
      }).then(() => {
        this.isShowNewDataModal = false;
        this.$Message.info("添加成功");
        this.getMetadataList().then(() => {
          this.currentCatalog = this.catalog.find(item => {
            return item.id == this.currentPage;
          });
        });
      });
    },
    cancel() {
      this.isShowNewDataModal = false;
    },
    deleteData(id){
      this.delMetadata({
        id,
      }).then(() => {
        this.$Message.info("删除成功");
        this.getMetadataList().then(() => {
          this.currentCatalog = this.catalog.find(item => {
            return item.id == this.currentPage;
          });
        });
      });
    }
  }
};
</script>

<style scoped>
.root-container {
  display: flex;
  flex-direction: row;
  height: 100%;
}
.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
}
.tool-container {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  border-bottom: 1px solid #bfbfbf;
  padding: 0 30px;
}
.content-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 50px;
}
.data-item {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
}
</style>
