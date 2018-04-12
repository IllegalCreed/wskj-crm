<template>
<div class="root-container">
  <div class="header-container">
    <div class="search-container">
      <Input v-model="search_content" placeholder="客户搜索" style="width: 200px">
        <Button slot="append" icon="ios-search" @click="getChanceList"></Button>
      </Input>
      <Select v-model="currentState" style="width: 200px;margin-left:30px;" placeholder="状态筛选" @on-change="stateChanged">
        <Option v-for="item in stateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
    </div>
    <Button type="primary" shape="circle" icon="plus-round" @click="createChance">新建机会</Button>
  </div>
  <div class="main-container">
    <Table border :columns="columnsData" :data="chance_list"></Table>
    <Page class="page" :current.sync="current_page_index" :total="chance_count" :page-size="page_size" @on-change="handleChangePageIndex"></Page>
  </div>
  <Modal
    v-model="isShowNewChanceModal"
    title="新建/编辑机会"
    @on-ok="ok"
    @on-cancel="cancel"
    :styles="modelStyles">
    <Form :model="createFormItem" :label-width="100">
        <Row>
            <Col span="12">
                <FormItem label="id">
                    <p>{{createFormItem.chance_id}}</p>
                </FormItem>
            </Col>
            <Col span="12">
                <FormItem label="评分">
                    <Rate v-model="createFormItem.customer.star"></Rate>
                </FormItem>
            </Col>
        </Row>
        <h3 style="margin-bottom:30px">客户基本信息</h3>
        <Row>
            <Col span="12">
                <FormItem label="名称">
                  <AutoComplete
                    @on-select="handleSearchNameSelect"
                    v-model="createFormItem.customer.name"
                    @on-search="handleSearchName"
                    placeholder="请输入"
                    style="width:200px">
                    <Option v-for="item in SearchNameList" :value="item.name" :key="item.customer_id">{{ item.name }}</Option>
                    </AutoComplete>
                </FormItem>
            </Col>
            <Col span="12">
                <FormItem label="主营业务">
                  <Select v-model="createFormItem.customer.md_main_business_id" style="width:200px;">
                    <Option :value="item.id" :key="item.id" :name="item.id" v-for="(item, index) in customer_service">{{item.name}}</Option>
                  </Select>
                </FormItem>
            </Col>
        </Row>
        <Row>
            <Col span="12">
                <FormItem label="联系人">
                  <Input v-model="createFormItem.customer.contact" placeholder="请输入" style="width:200px;"></Input>
                </FormItem>
            </Col>
            <Col span="12">
                <FormItem label="电话">
                  <Input v-model="createFormItem.customer.phone" placeholder="请输入" style="width:200px;"></Input>
                </FormItem>
            </Col>
        </Row>
        <Row>
            <Col span="12">
                <FormItem label="类型">
                  <Select v-model="createFormItem.customer.md_type_id" style="width:200px;">
                    <Option :value="item.id" :key="item.id" :name="item.id" v-for="(item, index) in customer_type">{{item.name}}</Option>
                  </Select>
                </FormItem>
            </Col>
            <Col span="12">
                <FormItem label="来源">
                  <Select v-model="createFormItem.customer.md_source_id" style="width:200px;">
                    <Option :value="item.id" :key="item.id" :name="item.id" v-for="(item, index) in customer_origin">{{item.name}}</Option>
                  </Select>
                </FormItem>
            </Col>
        </Row>
        <FormItem label="地址">
            <Input v-model="createFormItem.customer.address" placeholder="请输入" style="width:500px;"></Input>
        </FormItem>
        <FormItem label="备注">
            <Input v-model="createFormItem.customer.more" type="textarea" :autosize="{minRows: 3,maxRows: 8}" placeholder="Enter something..." style="width:500px;"></Input>
        </FormItem>
        <Row>
            <Col span="8">
                <FormItem label="预计签单金额">
                  <InputNumber v-model="createFormItem.estimate" placeholder="请输入"></InputNumber>元
                </FormItem>
            </Col>
            <Col span="7">
                <FormItem label="实际签单金额">
                  <InputNumber v-model="createFormItem.real_amount" placeholder="请输入"></InputNumber>元
                </FormItem>
            </Col>
            <Col span="7">
                <FormItem label="回扣金额">
                  <InputNumber v-model="createFormItem.rebate" placeholder="请输入"></InputNumber>元
                </FormItem>
            </Col>
        </Row>
        <Row>
            <Col span="8">
                <FormItem label="项目类型">
                  <Input v-model="createFormItem.project_type" placeholder="请输入" style="width:100px;"></Input>
                </FormItem>
            </Col>
            <Col span="16">
                <FormItem label="项目简介">
                  <Input v-model="createFormItem.project_desc" placeholder="请输入" style="width:340px;"></Input>
                </FormItem>
            </Col>
        </Row>
        <h3 style="margin-bottom:20px">进度追踪</h3>
        <div class="track" v-for="(item, index) in createFormItem.progress" :key="index" style="margin-bottom:20px;width:700px;border-radius:10px">
          <FormItem label="进度">
            <Select v-model="item.md_type_id" style="width:200px;" :disabled="item.progress_id">
             <Option :value="item.id" :key="item.id" :name="item.id" v-for="(item, index) in track_progress">{{item.name}}</Option>
            </Select>
          </FormItem>
          <FormItem label="日期">
            <DatePicker type="date" placeholder="Select date" v-model="item.insert_time" :disabled="item.progress_id"></DatePicker>
          </FormItem>
          <FormItem label="打款金额" v-if="item.md_type_id == 24 || item.md_type_id == 25 ||item.md_type_id == 26" >
            <InputNumber v-model="item.money" placeholder="请输入" :disabled="item.progress_id"></InputNumber>元
          </FormItem>
          <FormItem label="内容">
            <Input v-model="item.content" type="textarea" :autosize="{minRows: 3,maxRows: 8}" placeholder="Enter something..." style="width:500px;" :disabled="item.progress_id"></Input>
          </FormItem>
        </div>
        <Button type="primary" shape="circle" icon="plus-round" @click="createTrack" style="margin-bottom:20px">新建进度</Button>
        <h3 style="margin-bottom:20px">机会结果</h3>
        <FormItem label="机会结果">
          <Button type="success" @click="chance_success" :disabled="createFormItem.state != 0" v-if="createFormItem.state != -1">成单</Button>
          <Button type="error" @click="chance_fail" :disabled="createFormItem.state != 0" v-if="createFormItem.state != 1">跑单</Button>
        </FormItem>
    </Form>
  </Modal>
</div>
</template>

<script>
import * as chance from "../api/chance";
import dateFormat from "../utils/dateFormat";
import { mapActions, mapState, mapGetters } from "vuex";
export default {
  data() {
    return {
      current_page_index: 1,
      SearchNameList: [],
      modelStyles: {
        width: "800px",
        marginBottom: "100px"
      },
      isShowNewChanceModal: false,
      search_content: "",
      currentState: -100,
      stateList: [
        {
          value: -100,
          label: "全部"
        },
        {
          value: 1,
          label: "成单"
        },
        {
          value: 0,
          label: "未选"
        },
        {
          value: -1,
          label: "跑单"
        }
      ],
      columnsData: [
        {
          title: "id",
          key: "chance_id",
          width: 70,
          align: "center"
        },
        {
          title: "客户名称",
          key: "customer_name",
          width: 100
        },
        {
          title: "当前进度",
          key: "last_progress_name",
          width: 100
        },
        {
          title: "联系人",
          key: "contact",
          width: 80
        },
        {
          title: "电话",
          key: "phone",
          width: 120
        },
        {
          title: "项目类型",
          key: "project_type"
          // width: 200
        },
        {
          title: "项目简介",
          key: "project_desc"
          // width: 200
        },
        {
          title: "销售负责人",
          key: "head_user_name",
          width: 120
        },
        {
          title: "签单金额",
          key: "real_amount"
          // width: 120
        },
        {
          title: "创建时间",
          key: "create_time",
          width: 160
        },
        {
          title: "最后追踪时间",
          key: "last_progress_time",
          width: 160
        },
        {
          title: "状态",
          key: "state"
          // width: 150
        },
        {
          title: "操作",
          key: "action",
          width: 100,
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
                      this.editChance(params.row);
                    }
                  }
                },
                "编辑"
              )
            ]);
          }
        }
      ],
      createFormItem: {
        chance_id: -1,
        customer: {
          customer_id: -1,
          name: "",
          md_main_business_id: -1,
          contact: "",
          phone: "",
          md_type_id: -1,
          md_source_id: -1,
          address: "",
          more: "",
          star: 0
        },
        estimate: 0,
        real_amount: 0,
        rebate: 0,
        project_type: "",
        project_desc: "",
        progress: [
          {
            progress_id: null,
            md_type_id: -1,
            content: "",
            money: 0,
            insert_time: new Date()
          }
        ],
        state: 0
      }
      // rules: {
      //   estimate: [
      //     {
      //       type: "number",
      //       message: "必须是数字",
      //       trigger: "blur"
      //     }
      //   ],
      //   real_amount: [
      //     {
      //       type: "number",
      //       message: "必须是数字",
      //       trigger: "blur"
      //     }
      //   ],
      //   rebate: [
      //     {
      //       type: "number",
      //       message: "必须是数字",
      //       trigger: "blur"
      //     }
      //   ],
      //   "customer.phone": [
      //     {
      //       type: "number",
      //       message: "必须是数字",
      //       trigger: "blur"
      //     }
      //   ]
      // }
    };
  },
  mounted() {
    this.getChanceList();
    // 设置当前页码，用来切换模块后返回时还是在这个页
    this.current_page_index = this.page_index + 1;
  },
  computed: {
    ...mapGetters({
      customer_service: "customer_service",
      customer_type: "customer_type",
      customer_origin: "customer_origin",
      track_progress: "track_progress"
    }),
    ...mapState({
      page_size: state => state.chance.page_size,
      page_index: state => state.chance.page_index,
      chance_list: state => state.chance.chance_list,
      chance_count: state => state.chance.chance_count
    })
  },
  methods: {
    ...mapActions({
      getChanceListAction: "getChanceList",
      addOrUpdateChance: "addOrUpdateChance"
    }),
    stateChanged(value) {
      this.getChanceList();
    },
    chance_success() {
      this.createFormItem.state = 1;
    },
    chance_fail() {
      this.createFormItem.state = -1;
    },
    createChance() {
      this.isShowNewChanceModal = true;
      this.createFormItem = {
        chance_id: -1,
        customer: {
          customer_id: -1,
          name: "",
          md_main_business_id: -1,
          contact: "",
          phone: "",
          md_type_id: -1,
          md_source_id: -1,
          address: "",
          more: "",
          star: 0
        },
        estimate: 0,
        real_amount: 0,
        rebate: 0,
        project_type: "",
        project_desc: "",
        progress: [
          {
            progress_id: undefined,
            md_type_id: -1,
            content: "",
            money: 0,
            insert_time: new Date()
          }
        ],
        state: 0
      };
    },
    editChance(chanceData) {
      chance
        .getChanceDetail(chanceData.chance_id)
        .then(res => {
          if (res.data.res_code == 1) {
            // console.log(res.data.msg)
            for (let item of res.data.msg.progress) {
              item.insert_time = new Date(item.insert_time);
            }
            this.createFormItem = res.data.msg;
            this.isShowNewChanceModal = true;
          } else {
          }
        })
        .catch(reason => {
          console.log(reason);
        });
    },
    ok() {
      let params = {};
      params.chance_id = this.createFormItem.chance_id;
      params.customer = this.createFormItem.customer;
      params.estimate = this.createFormItem.estimate;
      params.real_amount = this.createFormItem.real_amount;
      params.rebate = this.createFormItem.rebate;
      params.project_type = this.createFormItem.project_type;
      params.project_desc = this.createFormItem.project_desc;
      params.progress = [];
      for (let item of this.createFormItem.progress) {
        if (!item.progress_id) {
          let progressItem = {};
          // progressItem.progress_id = -1;
          progressItem.md_type_id = item.md_type_id;
          progressItem.content = item.content;
          progressItem.money = item.money;
          progressItem.insert_time = dateFormat(
            item.insert_time,
            "YYYY-MM-DD HH:mm"
          );
          params.progress.push(progressItem);
        }
      }
      params.state = this.createFormItem.state;
      this.addOrUpdateChance(params).then(() => {
        this.getChanceList();
        this.isShowNewChanceModal = false;
        this.$Message.info("添加成功");
      });
    },
    cancel() {
      this.isShowNewChanceModal = false;
    },
    createTrack() {
      this.createFormItem.progress.push({
        progress_id: undefined,
        md_type_id: -1,
        content: "",
        money: 0,
        insert_time: new Date()
      });
    },
    handleSearchName(value) {
      this.createFormItem.customer.customer_id = -1;
      if (value && value != "") {
        chance.searchChanceByCustomerName(value).then(res => {
          if (res.data.res_code == 1 && res.data.msg.length > 0) {
            this.SearchNameList = res.data.msg;
          }
        });
      }
    },
    handleSearchNameSelect(value) {
      let customer = this.SearchNameList.find(item => {
        return item.name == value;
      });
      this.createFormItem.customer.customer_id = customer.customer_id;
      this.createFormItem.customer.md_main_business_id =
        customer.md_main_business_id;
      this.createFormItem.customer.contact = customer.contact;
      this.createFormItem.customer.phone = customer.phone;
      this.createFormItem.customer.md_type_id = customer.md_type_id;
      this.createFormItem.customer.md_source_id = customer.md_source_id;
      this.createFormItem.customer.address = customer.address;
      this.createFormItem.customer.more = customer.more;
      this.createFormItem.customer.star = customer.star;
    },
    handleChangePageIndex(page) {
      if (page != this.page_index + 1) {
        this.$store.commit(type.SET_CHANCE_PAGE_INDEX, page - 1);
        this.getUserList();
      }
    },
    getChanceList() {
      var params = {};
      params.name = this.search_content;
      if (this.currentState != -100) {
        params.state = this.currentState;
      }
      params.page_index = this.page_index;
      params.page_size = this.page_size;
      this.getChanceListAction(params);
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
.search-container {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
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
.track {
  border: 1px solid #dfdfdf;
  padding: 30px 0;
}
</style>
