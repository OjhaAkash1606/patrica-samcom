import type { ISOCode } from 'data/countries';
import { Permission, Type } from 'constants/config';
import type {
  ArchivedPropertyTaskResponse,
  PropertyMedia,
  PropertyTaskResponse,
  PublishedPropertyTaskResponse,
  SkinCategory,
  SkinImage,
} from 'types/properties';
import type {
  BaseUserResponse,
  HandlerResponse,
  IAddress,
  KPI,
  MediaFile,
  ProjectAddress,
  TeamPatriciaKPIInfo,
} from 'types/common.types';
import type {
  Category,
  PriceRange,
  Product,
  ProductPhoto,
  ProductSize,
} from 'types/products';
import type {
  FileStatus,
  SupplierAttachment,
  SupplierCategory,
} from 'types/suppliers';
import type { Order } from 'types/orders';
import type { Department, RoleInfo, RoleTypeKeys } from 'types/teamPatricia';
import type { UserTypeKeys } from 'types/clients';
import {
  SupplierStatsData,
  SupplierStatisticsResponse as StatisticsResponse,
} from 'store/types/user-management/suppliers.types';
import { Units } from 'types/projects';

// Authentication
export type Authentication = {
  token: string;
  user: {
    id: number;
    avatar?: string;
    email: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    permissions: Permission[];
    type: Type;
    role?: string;
    supplier?: number;
    seller_supplier?: number;
    property_id?: number;
    profile_picture?: string;
  };
};

export type Info = {
  detail: string;
};

export type Address = {
  id: number;
  apartment_number: number;
  elevator: boolean;
  city: string;
  country: string;
  floor?: string;
  house?: string;
  is_primary: boolean;
  street?: string;
  address_line_1?: string;
  address_line_2?: string;
  zip_code: string;
  state?: string;
};

export interface User extends BaseUserResponse {
  avatar: string;
  last_seen: string;
  created_at: string;
  archived_date: string;
  type: UserTypeKeys;
  country: ISOCode;
  addresses: Address[];
  is_archived: boolean;
  supplier?: number | string;
}

export interface ClientUser extends User {
  status: string[];
  supplier?: number;
  team_member?: number;
}

export type TeamPatriciaMember = {
  id: string;
  user: User;
  department: keyof typeof Department;
  role: RoleInfo;
  property_kpi_info?: TeamPatriciaKPIInfo;
};

export interface ClientInfo extends ClientUser {
  KPIs: KPI[];
  orders: { results: Order[]; count: number };
  products: { results: Product[]; count: number };
  properties: { results: Property[]; count: number };
}

export type OrderDetail = {
  id: string;
  order_id: number;
  quantity: number;
  created_at: string;
  product: ResponseProduct;
  shipping_address: Address;
  estimated_date: string;
  updated_at: string;
  status: string;
  unit_price: number;
  total_row: number;
  sub_total: number;
  vat: number;
  final_price: number;
};

export type ResponseProduct = {
  id: string;
  sku: string;
  sub_category: Category;
  category: Category;
  english_name: string;
  created_at: number;
  updated_at: number;
  english_description: string;
  price: number;
  discount_percent: number;
  original_price: number;
  vat_amount: number;
  manufacturer: {
    id: number;
    name: string;
    country: ISOCode;
  };
  files: string[];
  media: ProductPhoto[];
  ortho_thumbnail: ProductPhoto;
  thumbnail: ProductPhoto;
  discount_price: number;
  discount_group_id: string;
  price_range: PriceRange;
  series: string;
  supplier: SupplierUser;
  webpage_link: string;
  back_in_stock_date: Date;
  in_stock: boolean;
  quantity: number;
  unit_price: number;
  colors: Color[];
  sold_quantity: number;
  total_sales: number;
  status?: string;
  size?: string | ProductSize;
  alt_name: string;
  tags: string[];
  type: string;
  msrp: number;
  not_for_sale: boolean;
  modelling_time: string | number;
};

export type QuoteComponent = {
  id: number;
  metadata: {};
  product: ResponseProduct;
  quote: number;
  room: { id: number; name: string };
};

export type SupplierUser = {
  user: User;
  id: string;
  company_name: string;
  additional_phone_number: string;
  products_quantity: number;
  registered_id: string | null;
  kpi_items: KPI[];
  webpage_link: string | null;
  categories: SupplierCategory[];
  total_sales: number;
  logo: string;
  sku_prefix: string;
};

export type ProductQuoteComponents = {
  product_id: number;
};

export type ResponseOrder = {
  id: number;
  client: BaseUserResponse;
  supplier: SupplierUser;
  status: string;
  property: string;
  total_price: number;
  order_details: OrderDetail[];
  shipping_address: Address;
  created_at: string;
  estimated_date: string;
  shipping_date: string;
  delivery_date: string;
  tracking_number: string;
  sub_total: number;
  vat: number;
  final_price: number;
  transaction_id?: number;
  discount?: number;
};

export type ResponseUnits = {
  id: number;
  building: string;
  cover_photo: string | null;
  created_at: string;
  floor_plan: string;
  type: string;
  updated_at: string;
  property_count: number;
};

export type ResponseProjectDetail = {
  id: number;
  address: ProjectAddress;
  cover_photo: string;
  created_at: string;
  description: string;
  name: string;
  number: string;
  property_count: number;
  supplier: number;
  unit_file: string;
  units: ResponseUnits[];
  updated_at: string;
  developer: {
    name?: string;
    logo?: string | null;
    id: number;
  };
};

export type Supplier = {
  avatar?: string | null;
  addresses: IAddress[] | null;
  KPIs?: KPI[];
  orders?: { results: Order[]; pageCount?: number };
  products?: { results: Product[]; pageCount?: number };
  files?: { results: SupplierAttachment[]; pageCount?: number };
  website?: string | null;
  registeredNumber?: string | null;
  statistics?: StatisticsResponse;
};

export type Role = {
  id: number;
  name: string;
  permissions: RoleTypeKeys | RoleTypeKeys[];
  department: keyof typeof Department;
};

export type BaseUserForm = Omit<BaseUserResponse, 'id'> &
  Partial<Omit<Address, 'is_primary' | 'elevator' | 'id'>>;

export type RegisterKey = BaseUserResponse & {
  address: Address;
  type: Type;
};

export type DesignStyleRoomSubCategory = {
  id: number;
  sub_category: { id: number; name: string };
  thumbnail: string | null;
  products?: ResponseProduct[];
  products_count: number;
};

export type DesignStyleRoom = {
  id: number;
  room: { id: number; name: string };
  design_style_room_sub_categories: DesignStyleRoomSubCategory[];
  sub_categories_count: number;
  products_count: number;
};

export type DesignStyle = {
  id: number;
  user: Pick<BaseUserResponse, 'id' | 'first_name' | 'last_name'>;
  name: string;
  products_count: number;
  quizzes: Pick<Quiz, 'id' | 'created_at' | 'name'>[];
  design_style_rooms?: DesignStyleRoom[];
  created_at: string;
  countries: ISOCode[];
};

export type PriceTagResponse = 'low' | 'medium' | 'high' | 'extra';

export type QuizAnswer = {
  id?: number;
  text?: string;
  answer: string | MediaFile;
  color_tag: Color | number;
  design_style: DesignStyle | number;
  price_tag: PriceTagResponse;
  tags: string[];
  colors?: string[];
  panorama: null | { id: number; name: string; thumbnail: string };
};

export type QuizQuestion = {
  id: number;
  quiz?: number;
  question: string;
  answers: QuizAnswer[];
};

export type BaseProperty = Pick<Property, 'id' | 'link' | 'name'>;

export type QuizResult = {
  id: number;
  quiz: BaseQuiz | null;
  properties: BaseProperty[];
  result: {
    id: number;
    name: string;
    image: string | null;
  };
  updated_at: string;
  created_at: string;
};

export type BaseQuiz = {
  id: number;
  name: string;
  created_at: string;
  countries: [];
};

export type Quiz = BaseQuiz & {
  design_styles: { id: number; name: string }[];
  owner: HandlerResponse;
  is_primary: boolean;
  welcome_text: string;
  thank_you_text: string;
  questions: QuizQuestion[];
  question_count: number;
  countries: ISOCode[];
};

export type Color = { id: string; name: string; color_hex: string };

export type Property = {
  id: number;
  name: string;
  owner?: HandlerResponse;
  link?: string;
  created_at?: string;
  media?: PropertyMedia[];
  quiz?: BaseQuiz;
  quiz_result?: QuizResult;
  updated_at?: string;
  status: string;
  unit?: Units;
  co_owners?: number[];
};

export type developer = {
  created_at?: string;
  description?: string;
  id?: number;
  logo?: string;
  name?: string;
  updated_at?: string;
  website?: string;
};

export type Project = {
  id: number;
  name: string;
  number: number;
  supplier: number;
  unit_file?: string | null;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
  cover_photo?: string;
  address?: IAddress | null;
  developer?: developer | null;
};

export type ResponseFile = {
  id: number;
  file: string | null;
  missing_data_file: string | null;
  file_name: string;
  type: string;
  task_id: string;
  status: FileStatus;
  failed: number;
  succeed: number;
  missing_data: number;
  created: number;
  updated: number;
  uploaded: number;
  total: number;
};

export interface ThreeDProducts extends ResponseProduct {
  assignee: HandlerResponse;
}

export interface CartItem {
  id: number;
  product: {
    id: number;
    alt_name: string;
    colors: Color[];
    english_name: string;
    sku: string;
    supplier: {
      id: number;
      logo: MediaFile;
      company_name: string;
    };
    original_price: number;
    final_price: number;
    technical_info: Record<string, unknown>;
    quantity: number;
    thumbnail: MediaFile;
    sub_category: {
      id: number;
      name: string;
      alt_name: string;
    };
    not_for_sale: boolean;
  };
  quantity: number;
  checkout_quantity: number | null;
}

export interface Cart {
  id?: number;
  property?: { id: number; name: string; link: string };
  shopping_cart_items?: CartItem[];
  sub_total: number;
  vat: number;
  final_price: number;
  tax_rate?: number;
}

export interface PropertyCart {
  id: number;
  property_shopping_carts: Cart[];
  user: number;
}

export interface CheckoutCart {
  id: number;
  items: CartItem[];
  address: Address;
  final_price: number;
  sub_total: number;
  vat: number;
  total_price: number;
  total_discount: number;
  coupon: string;
  hs: string;
  tax_rate: number;
}

export interface Activity {
  id: number;
  description: string;
  created_at: string;
}

export interface UserActivities {
  id: number;
  user: number;
  activities: Activity[];
}

export interface UserLogs {
  name: string;
  area: string;
  section: string;
  path: string;
  action?: string;
  metadata?: Object;
  user?: string;
  id?: number;
  created_at: string;
}

export type SearchResponse = {
  products: Products;
  category: Categories;
  sub_categories: Categories;
  suppliers: SuppliersUsers;
  query: {
    text: string;
    count: number;
  };
};

export type SkinCreatorResponse = {
  id: number;
  description?: string;
  logo?: string;
  name: string;
  skin_images?: SkinImage[];
};

export type Skin = {
  id: number;
  name: string;
  description?: string;
  price: number;
  price_range?: PriceRange;
  color?: Color;
  skin_category: SkinCategory;
  is_public: boolean;
  is_locked: boolean;
  is_popular: boolean;
  rating: number;
  final_price: number;
  vat: number;
  sub_total: number;
  number_of_downloads: number;
  desktop_thumbnail?: string;
  mobile_thumbnail?: string;
  rooms?: {
    id: number;
    room_id: number;
    room_name: string;
    sub_categories: {
      id: number;
      sub_category_id: number;
      name: string;
      products: ResponseProduct[];
    }[];
  }[];
  user: {
    id: number;
    name: string;
    link?: string;
    rating?: string;
    skin_creator?: SkinCreatorResponse;
  };
  thumbnail?: string;
  country: string;
  budget: number;
  created_at: string;
};

export type ProductCoin = {
  id: number;
  type: string;
  alt_name: string;
  english_name: string;
  original_price: string;
  final_price: number;
  price: number;
  quantity: number;
};

export type Stories = {
  story_section_title: string;
  stories: Story[];
};

export type Story = {
  id: number;
  story_name: string;
  story_type: string;
  file: string;
  type: string;
  story_order: number;
  duration: number;
};

export type SupplierStatisticsResponse = {
  total_profit: number;
  total_products: number;
  orders_count: number;
  income: SupplierStatsData[];
  orders: SupplierStatsData[];
  sold_products: SupplierStatsData[];
};

export type IdeasDetails = {
  id: number;
  name: string | null;
  file: string | null;
  metadata?: string | object;
  type: string;
  created_at: string;
  property?: string;
  products?: ResponseProduct[];
  view_count?: string | number;
  user: {
    id: number | null;
    first_name: string | null;
    last_name: string | null;
    profile_picture: string | null;
  } | null;
};

export type BackgroundTask = {
  id: number;
  progress: number;
  status: string;
  completed_at: string;
  started_at: string;
  result: string | null;
  file_results: {
    file: string;
  }[];
};
export type RoomDetails = {
  id: string;
  name: string | null;
};

export interface TableData<D> {
  count: number;
  results: D[];
  next?: string | number | null;
  previous?: string | number | null;
}

export interface ClientsUsers extends TableData<ClientUser> {}
export interface SuppliersUsers extends TableData<SupplierUser> {}
export interface PatriciaUsers extends TableData<TeamPatriciaMember> {}
export interface ClientProducts extends TableData<OrderDetail> {}
export interface Properties extends TableData<Property> {}
export interface Projects extends TableData<Project> {
  id: number;
  name: string;
  number: number;
  supplier: number;
  unit_file?: string | null;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
  cover_photo?: string;
  address?: IAddress | null;
  developer?: developer | null;
}

export interface Attachments extends TableData<SupplierAttachment> {}
export interface Products extends TableData<ResponseProduct> {}
export interface QuoteComponents extends TableData<QuoteComponent> {}
export interface SupplierOrders extends TableData<Order> {}
export interface Skins extends TableData<Skin> {}
export interface ProductCoins extends TableData<ProductCoin> {}
export interface ideaList extends TableData<IdeasDetails> {}
export interface RoomList extends TableData<RoomDetails> {}
export interface PaginatedCart extends TableData<CartItem> {
  sub_total?: number;
  vat?: number;
  final_price?: number;
  tax_rate?: number;
}
export interface Orders extends TableData<ResponseOrder> {
  purchased_products: number;
  total_money_spent: number;
}
export interface Roles extends TableData<Role> {}
export interface Quizzes extends TableData<Quiz> {}
export interface QuizResults extends TableData<QuizResult> {}
// properties management
export interface NewTasks extends TableData<PropertyTaskResponse> {}
export interface PublishedTasks
  extends TableData<PublishedPropertyTaskResponse> {}
export interface ArchivedTasks
  extends TableData<ArchivedPropertyTaskResponse> {}
// 3d content management
export interface ThreeDAllTasks extends TableData<ThreeDProducts> {}
export interface ThreeDInDb extends TableData<ThreeDProducts> {}
export interface FileTasks extends TableData<ResponseFile> {}
export interface DesignStyles extends TableData<DesignStyle> {}
export interface Categories extends TableData<Category> {}
export interface PaginatedLogs extends TableData<UserLogs> {}
export type Responses =
  | Authentication
  | Info
  | ClientsUsers
  | ClientInfo
  | PatriciaUsers
  | SuppliersUsers
  | SupplierUser
  | Supplier
  | ClientProducts
  | Products
  | Properties
  | SupplierOrders
  | Orders
  | Roles
  | Attachments
  | NewTasks
  | FileTasks
  | void
  | Stories
  | Story
  | PaginatedLogs
  | PaginatedCart
  | unknown;
