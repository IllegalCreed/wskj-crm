<template>
<div class="root-container">
  <div class="header-container">
    <Input v-model="search_content" placeholder="搜索" clearable style="width: 200px">
      <Button slot="append" icon="ios-search"></Button>
    </Input>
    <Button type="primary" shape="circle" icon="plus-round" @click="createUser">新建用户</Button>
  </div>
  <div class="main-container">
    <Table border :columns="columnsData" :data="user_list"></Table>
    <Page class="page" :current.sync="current_page_index" :total="user_count" :page-size="page_size" @on-change="handleChangePageIndex"></Page>
  </div>
  <Modal
    v-model="isShowNewUserModal"
    title="新建用户"
    @on-ok="ok"
    @on-cancel="cancel">
    <Form :model="createFormItem" :label-width="80">
        <FormItem label="姓名">
            <Input v-model="createFormItem.name" placeholder="请输入" style="width:200px;"></Input>
        </FormItem>
        <FormItem label="手机号">
            <Input v-model="createFormItem.phone" placeholder="请输入" style="width:200px;"></Input>
        </FormItem>
        <FormItem label="部门">
            <Select v-model="createFormItem.department" style="width:200px;">
                <Option value="beijing">New York</Option>
                <Option value="shanghai">London</Option>
                <Option value="shenzhen">Sydney</Option>
            </Select>
        </FormItem>
        <FormItem label="职位">
            <Input v-model="createFormItem.position" placeholder="请输入" style="width:200px;"></Input>
        </FormItem>
        <FormItem label="密码">
            <Input v-model="createFormItem.pwd" placeholder="请输入" style="width:200px;"></Input>
        </FormItem>
        <FormItem label="权限">
            <CheckboxGroup v-model="createFormItem.checkbox">
                <Checkbox label="管理员"></Checkbox>
                <Checkbox label="机会"></Checkbox>
                <Checkbox label="用户"></Checkbox>
                <Checkbox label="元数据"></Checkbox>
            </CheckboxGroup>
        </FormItem>
    </Form>
  </Modal>
  <Modal
    v-model="isShowEditUserModal"
    title="编辑用户"
    @on-ok="ok"
    @on-cancel="cancel">
    <Form :model="editFormItem" :label-width="80">
        <FormItem label="id">
            <p>{{editFormItem.id}}</p>
        </FormItem>
        <FormItem label="姓名">
            <Input v-model="editFormItem.name" placeholder="请输入" style="width:200px;"></Input>
        </FormItem>
        <FormItem label="手机号">
            <Input v-model="editFormItem.phone" placeholder="请输入" style="width:200px;"></Input>
        </FormItem>
        <FormItem label="部门">
            <Select v-model="editFormItem.department" style="width:200px;">
                <Option value="beijing">New York</Option>
                <Option value="shanghai">London</Option>
                <Option value="shenzhen">Sydney</Option>
            </Select>
        </FormItem>
        <FormItem label="职位">
            <Input v-model="editFormItem.position" placeholder="请输入" style="width:200px;"></Input>
        </FormItem>
        <FormItem label="修改密码">
            <Button v-if="!isShowChangePwd" type="primary" size="small" icon="edit" @click="ShowChangePwd">修改密码</Button>
            <Input v-if="isShowChangePwd" v-model="editFormItem.pwd" placeholder="请输入新密码" style="width:200px;"></Input>
            <Button v-if="isShowChangePwd" type="primary" size="small" icon="checkmark-round" @click="pwdChanged">保存</Button>
        </FormItem>
        <FormItem label="权限">
            <CheckboxGroup v-model="editFormItem.checkbox">
                <Checkbox label="管理员"></Checkbox>
                <Checkbox label="机会"></Checkbox>
                <Checkbox label="用户"></Checkbox>
                <Checkbox label="元数据"></Checkbox>
            </CheckboxGroup>
        </FormItem>
    </Form>
  </Modal>
</div>
</template>

<script>
import * as type from "../store/type";
import { mapActions, mapState, mapGetters } from "vuex";
export default {
  data() {
    return {
      current_page_index: 1,

      isShowChangePwd: false,
      isShowEditUserModal: false,
      isShowNewUserModal: false,
      search_content: "",
      columnsData: [
        {
          title: "id",
          key: "user_id",
          width: 70,
          align: "center"
        },
        {
          title: "姓名",
          key: "name",
          width: 80
        },
        {
          title: "手机号",
          key: "phone",
          width: 120
        },
        {
          title: "部门",
          key: "md_department_name"
        },
        {
          title: "职位",
          key: "position"
        },
        {
          title: "权限",
          key: "role",
          width: 120,
          render: (h, params) => {
            return h("p", {}, () => {
              let result = "";
              for (let role of params.row.role) {
                result += role.name;
              }
              return result;
            });
          }
        },
        {
          title: "状态",
          key: "freeze",
          width: 150
        },
        {
          title: "创建时间",
          key: "create_time",
          width: 160
        },
        {
          title: "操作",
          key: "action",
          width: 180,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.editUser(params.row);
                    }
                  }
                },
                "编辑"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.show(params.row);
                    }
                  }
                },
                "冻结"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.remove(params.row);
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      createFormItem: {
        id: 0,
        name: "",
        phone: "",
        department: "",
        position: "",
        pwd: "",
        checkbox: []
      },
      editFormItem: {
        id: 0,
        name: "",
        phone: "",
        department: "",
        position: "",
        pwd: "",
        checkbox: []
      }
    };
  },
  mounted() {
    this.getUserList();

    // 设置当前页码，用来切换模块后返回时还是在这个页
    this.current_page_index = this.page_index + 1;
  },
  computed: {
    ...mapState({
      page_size: state => state.user.page_size,
      page_index: state => state.user.page_index,
      user_list: state => state.user.user_list,
      user_count: state => state.user.user_count
    })
  },
  methods: {
    ...mapActions({
      getUserListAction: "getUserList",
      addOrUpdateUser: "addOrUpdateUser"
    }),
    createUser() {
      this.isShowNewUserModal = true;
    },
    editUser(user) {
      this.isShowEditUserModal = true;
    },
    ShowChangePwd() {
      this.isShowChangePwd = true;
    },
    pwdChanged() {
      this.$Message.info("修改成功");
      this.isShowChangePwd = false;
    },
    ok() {
      this.isShowNewDataModal = false;
      this.$Message.info("添加成功");
    },
    cancel() {
      this.isShowNewDataModal = false;
    },
    handleChangePageIndex(page) {
      if (page != this.page_index + 1) {
        this.$store.commit(type.SET_USER_PAGE_INDEX, page - 1);
        this.getUserList();
      }
    },
    getUserList() {
      var params = {};
      params.name = this.search_content;
      params.page_index = this.page_index;
      params.page_size = this.page_size;
      this.getUserListAction(params);
    }
  }
};
</script>

<style scoped>
.header-container {
  height: 80px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.root-container {
  height: 100%;
  overflow: scroll;
  display: flex;
  flex-direction: column;
  padding: 0 30px 30px 30px;
}
.main-container {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  flex: 1;
}
.page {
  margin-bottom: 30px;
  margin-top: 30px;
  align-self: flex-end;
}
</style>
