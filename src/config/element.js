import Vue from 'vue';
import {
    Button,
    ButtonGroup,
    Container,
    Header,
    Aside,
    Main,
    Footer,
    Row,
    Col,
    Menu,
    Submenu,
    MenuItem,
    MenuItemGroup,
    Card,
    Input,
    InputNumber,
    Radio,
    RadioGroup,
    RadioButton,
    Checkbox,
    CheckboxButton,
    CheckboxGroup,
    Switch,
    Select,
    Option,
    OptionGroup,
    Dialog,
    Form,
    FormItem,
    Breadcrumb,
    BreadcrumbItem,
    Table,
    TableColumn,
    Pagination,
    Loading,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Message,
    MessageBox,
    Upload,
    cascader,
    Tooltip,
    Tag,
    Image,
} from 'element-ui';

Vue.use(Button);
Vue.use(ButtonGroup);
Vue.use(Container);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Footer);
Vue.use(Row);
Vue.use(Col);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(MenuItemGroup);
Vue.use(Card);
Vue.use(Input);
Vue.use(InputNumber);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(RadioButton);
Vue.use(Checkbox);
Vue.use(CheckboxButton);
Vue.use(CheckboxGroup);
Vue.use(Switch);
Vue.use(Select);
Vue.use(Option);
Vue.use(OptionGroup);
Vue.use(Dialog);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Pagination);
Vue.use(Loading.directive);
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Upload);
Vue.use(cascader);
Vue.use(Tooltip);
Vue.use(Tag);
Vue.use(Image);


Vue.prototype.$loading = Loading.service;
Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm;
