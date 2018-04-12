<template>
<div class="root-container">
  <div class="header-container">
    <Input v-model="search_content" placeholder="搜索" style="width: 200px">
      <Button slot="append" icon="ios-search" @click="getUserList"></Button>
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
    @on-ok="ok_create"
    @on-cancel="cancel_create">
    <Form :model="createFormItem" :label-width="80">
        <FormItem label="姓名">
            <Input v-model="createFormItem.name" placeholder="请输入" style="width:200px;"></Input>
        </FormItem>
        <FormItem label="手机号">
            <Input v-model="createFormItem.phone" placeholder="请输入" style="width:200px;"></Input>
        </FormItem>
        <FormItem label="部门">
            <Select v-model="createFormItem.department" style="width:200px;">
                <Option :value="item.id" :key="item.id" :name="item.id" v-for="(item, index) in user_department">{{item.name}}</Option>
            </Select>
        </FormItem>
        <FormItem label="职位">
            <Input v-model="createFormItem.position" placeholder="请输入" style="width:200px;"></Input>
        </FormItem>
        <FormItem label="密码">
            <Input v-model="createFormItem.pwd" placeholder="请输入" style="width:200px;"></Input>
        </FormItem>
        <FormItem label="权限">
            <CheckboxGroup v-model="createFormItem.permission">
                <Checkbox :label="item.role_id" :key="item.role_id" v-for="(item, index) in roles">{{item.name}}</Checkbox>
            </CheckboxGroup>
        </FormItem>
    </Form>
  </Modal>
  <Modal
    v-model="isShowEditUserModal"
    title="编辑用户"
    @on-ok="ok_edit"
    @on-cancel="cancel_edit">
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
                <Option :value="item.id" :key="item.id" :name="item.id" v-for="(item, index) in user_department">{{item.name}}</Option>
            </Select>
        </FormItem>
        <FormItem label="职位">
            <Input v-model="editFormItem.position" placeholder="请输入" style="width:200px;"></Input>
        </FormItem>
        <FormItem label="修改密码">
            <Button v-if="!isShowChangePwd" type="primary" size="small" icon="edit" @click="ShowChangePwd">修改密码</Button>
            <Input v-if="isShowChangePwd" v-model="newPwd" placeholder="请输入新密码" style="width:200px;"></Input>
            <Button v-if="isShowChangePwd" type="primary" size="small" icon="checkmark-round" @click="pwdChanged(editFormItem.id)">保存</Button>
        </FormItem>
        <FormItem label="权限">
            <CheckboxGroup v-model="editFormItem.permission">
                <Checkbox :label="item.role_id" :key="item.role_id" v-for="(item, index) in roles">{{item.name}}</Checkbox>
            </CheckboxGroup>
        </FormItem>
    </Form>
  </Modal>
</div>
</template>

<script>
import * as type from "../store/type";
import * as user from "../api/user";
import { mapActions, mapState, mapGetters } from "vuex";
export default {
  data() {
    return {
      current_page_index: 1,

      isShowChangePwd: false,
      isShowEditUserModal: false,
      isShowNewUserModal: false,
      newPwd: "",
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
          width: 120
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
                    type: params.row.freezeId == 0 ? "error" : "success",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.setFreeze(params.row.user_id).then(() => {
                        this.getUserList();
                      });
                    }
                  }
                },
                params.row.freezeId == 0 ? "冻结" : "解冻"
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
        id: -1,
        name: "",
        phone: "",
        department: "",
        position: "",
        pwd: "",
        permission: []
      },
      editFormItem: {
        id: 0,
        name: "",
        phone: "",
        department: "",
        position: "",
        permission: []
      }
    };
  },
  mounted() {
    this.getUserList();
    // 设置当前页码，用来切换模块后返回时还是在这个页
    this.current_page_index = this.page_index + 1;
  },
  computed: {
    ...mapGetters({
      user_department: "user_department"
    }),
    ...mapState({
      page_size: state => state.user.page_size,
      page_index: state => state.user.page_index,
      user_list: state => state.user.user_list,
      user_count: state => state.user.user_count,
      roles: state => state.user.roles
    })
  },
  methods: {
    ...mapActions({
      getUserListAction: "getUserList",
      addOrUpdateUser: "addOrUpdateUser",
      setFreeze: "setFreeze",
      resetPwd: "resetPwd"
    }),
    createUser() {
      this.createFormItem = {
        id: -1,
        name: "",
        phone: "",
        department: "",
        position: "",
        pwd: "",
        permission: []
      };
      this.isShowNewUserModal = true;
    },
    editUser(userData) {
      this.newPwd = "";
      user
        .getUserDetail(userData.user_id)
        .then(res => {
          if (res.data.res_code == 1) {
            this.editFormItem = {
              id: res.data.msg.user_id,
              name: res.data.msg.name,
              phone: res.data.msg.phone,
              department: res.data.msg.md_department_id,
              position: res.data.msg.position,
              permission: res.data.msg.role_ids
            };
            this.isShowEditUserModal = true;
          } else {
          }
        })
        .catch(reason => {
          console.log(reason);
        });
    },
    ShowChangePwd() {
      this.isShowChangePwd = true;
    },
    pwdChanged(id) {
      this.resetPwd({ id, pwd: this.newPwd }).then(() => {
        this.$Message.info("修改成功");
        this.isShowChangePwd = false;
      });
    },
    ok_create() {
      this.addOrUpdateUser(this.createFormItem).then(() => {
        this.getUserList();
        this.isShowNewDataModal = false;
        this.$Message.info("添加成功");
      });
    },
    cancel_create() {
      this.isShowNewDataModal = false;
    },
    ok_edit() {
      this.addOrUpdateUser(this.editFormItem).then(() => {
        this.getUserList();
        this.isShowEditUserModal = false;
        this.$Message.info("修改成功");
      });
    },
    cancel_edit() {
      this.isShowEditUserModal = false;
    },
    remove() {},
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
