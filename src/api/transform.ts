import * as Response from 'api/responses';
import {
  capitalize,
  isArray,
  isEmpty,
  isNumber,
  map,
} from 'utils/lodash.utils';
import {
  CLIENT_DATE_FORMAT,
  formatDate,
  formatTime,
  TABLE_DATE_FORMAT,
  TABLE_TIME_FORMAT,
} from 'utils/dates.utils';
import { transformByCountryCode } from 'utils/transform.utils';
import { Client, ClientStatus, UserActivities } from 'types/clients';
import {
  Product,
  ProductStatus,
  QuoteComponent,
  SearchResults,
  ThreeDTasksStatus,
  BulkAddToCartProduct,
  ProductCoin,
  IdeasDetails,
  BackgroundTask,
} from 'types/products';
import {
  FileStatus,
  FileTask,
  Supplier,
  SupplierOption,
} from 'types/suppliers';
import { RolePermission, RoleInfo, TeamMember } from 'types/teamPatricia';
import {
  Order,
  OrderAutoCompleteType,
  OrderDetail,
  OrderStatus,
  SupplierOrderStatus,
} from 'types/orders';
import { AddSupplierDataPayload } from 'pages/appManagement/common/AddUsersModal/AddSupplierModal/AddSupplierModal.config';
import { preferencesDefaultValues } from 'pages/appManagement/common/NewQuizModal/NewQuizModal.config';
import {
  getEnumKeyByValue,
  removeEmptyValues,
  removeHtmlTags,
} from 'utils/common.utils';
import { prefixPhoneNumber, toCurrencyString } from 'utils/string.utils';
import { GetQuizzesDataResponsePayload } from 'store/types/quizManagement.types';
import {
  DesignStyle,
  DesignStyleRoom,
  DesignStyleRoomSubcategory,
  Quiz,
  QuizAnswer,
  QuizQuestion,
  QuizResult,
} from 'types/quizzes';
import { NO_VALUE } from 'constants/common.constants';
import {
  ArchivedPropertyTask,
  ArchivedPropertyTaskResponse,
  Cart,
  CartItem,
  CheckoutCart,
  PaginatedCart,
  PaginatedSkin,
  Property,
  PropertyMediaType,
  PropertyTask,
  PropertyTaskResponse,
  PublishedPropertyTask,
  PublishedPropertyTaskResponse,
  Skin,
  SkinCategory,
} from 'types/properties';
import { GetPropertiesDataResponsePayload } from 'store/types/user-management/properties.types';
import {
  Get3DInDbDataResponsePayload,
  Get3DTasksDataResponsePayload,
} from 'store/types/3d-content-management/threeD.types';
import { GetFilesDataResponsePayload } from 'store/types/suppliers-interface/database.types';
import type { ISOCode } from 'data/countries';
import type {
  AccountPayload,
  OnboardingFields,
  RegisterPayload,
  RegisterRequestPayload,
} from 'store/types/authentication.types';
import type {
  GetProductsDataResponsePayload,
  GetQuizResultsDataResponsePayload,
  GetUserLogsResponsePayload,
  GetUsersDataResponsePayload as GetClientsResponsePayload,
  UserLogType,
} from 'store/types/user-management/clients.types';
import type {
  AddUserDataRequestPayload as AddTeamPatriciaUserPayload,
  GetRolesDataResponsePayload,
  GetUsersDataResponsePayload as GetTeamMembersResponsePayload,
} from 'store/types/user-management/teamPatricia.types';
import type {
  GetOrdersDataResponsePayload,
  GetProductsDataResponsePayload as GetSupplierProductsResponse,
  GetUsersDataResponsePayload as GetSuppliersResponsePayload,
  SupplierStatisticsResponse,
} from 'store/types/user-management/suppliers.types';
import type {
  BaseUser,
  BaseUserResponse,
  Handler,
  HandlerResponse,
  IAddress,
  KPI,
  MediaFile,
  Stories,
  Story,
  TeamPatriciaKPIInfo,
} from 'types/common.types';
import { GetDesignStylesDataResponsePayload } from 'store/types/designStyles.types';
import { ProductDataPayload } from 'pages/appSupplier/my-database/modals/ProductFormModal/ProductFormModal.config';
import { ProjectDetail } from 'types/projects';

export const AuthResponse = ({
  token,
  user,
}: Response.Authentication): AccountPayload => ({
  token,
  avatar: user.avatar,
  id: user.id,
  email: user.email,
  firstName: user.first_name,
  lastName: user.last_name,
  permissions: user.permissions ?? [],
  type: user.type,
  phoneNumber: user.phone_number,
  role: user.role,
  supplierId: user.supplier?.toString(),
  seller_supplier: user.seller_supplier,
  propertyId: user.property_id,
  profilePicture: user.profile_picture,
});

export const transformBaseUserData = ({
  first_name,
  last_name,
  phone_number,
  id,
  email,
  avatar,
  profile_picture,
}: BaseUserResponse): BaseUser => ({
  userID: id?.toString(),
  firstName: first_name,
  lastName: last_name,
  email,
  phoneNumber: phone_number,
  avatar,
  profilePicture: profile_picture,
});

export const transformHandler = (handler: HandlerResponse): Handler =>
  handler
    ? {
        userID: handler.id.toString(),
        firstName: handler.first_name,
        lastName: handler.last_name,
      }
    : null;

const transformUserData = ({
  type,
  addresses,
  avatar,
  country,
  archived_date,
  is_archived,
  ...baseUser
}: Response.User) => ({
  ...transformBaseUserData(baseUser),
  addresses: isEmpty(addresses) ? null : Addresses(addresses),
  avatar,
  country: transformByCountryCode(country as ISOCode),
  lastSeen: baseUser?.last_seen ? formatDate(baseUser.last_seen) : undefined,
  createdAt: baseUser?.created_at ? formatDate(baseUser.created_at) : undefined,
  archivedDate: formatDate(archived_date),
  isArchived: Boolean(is_archived),
  userType: type,
  supplier: baseUser.supplier as string,
});

export const PatriciaUserResponse = ({
  user,
  department,
  role,
  property_kpi_info,
  ...rest
}: Response.TeamPatriciaMember): TeamMember => ({
  ...transformUserData(user),
  department: role?.department,
  role,
  kpiInfo: TeamPatriciaKPItoTeamMemberKPI(property_kpi_info),
  ...rest,
});

export const TeamPatriciaKPItoTeamMemberKPI = (
  kpiInfo: TeamPatriciaKPIInfo | undefined
): KPI[] => [
  {
    label: 'Max published properties in a single day',
    value: kpiInfo?.published_properties_single_day ?? 0,
    unit: undefined,
  },
  {
    label: 'Total archived properties',
    value: kpiInfo?.total_archived_properties ?? 0,
    unit: undefined,
  },
  {
    label: 'Avg publishing time',
    value: kpiInfo ? formatTime(kpiInfo?.avg_publishing_time) : 0,
    unit: undefined,
  },
  {
    label: 'Best publishing time',
    value: kpiInfo ? formatTime(kpiInfo?.best_publishing_time) : 0,
    unit: undefined,
  },
];

export const PatriciaUsersResponse = ({
  count,
  results,
}: Response.PatriciaUsers): GetTeamMembersResponsePayload => ({
  count,
  results: map(results, PatriciaUserResponse),
});

export const UserAutoCompleteTransform = (
  results: BaseUserResponse[]
): BaseUser[] => map(results, transformBaseUserData);

export const TeamPatriciaAutoCompleteTransform = (
  results: Response.TeamPatriciaMember[]
): TeamMember[] =>
  map(results, ({ user, department, role, property_kpi_info, ...rest }) => ({
    ...transformUserData(user),
    department: role?.department,
    role,
    kpiInfo: TeamPatriciaKPItoTeamMemberKPI(property_kpi_info),
    ...rest,
  }));

export const SupplierUser = ({
  user,
  company_name,
  products_quantity,
  additional_phone_number,
  registered_id,
  webpage_link,
  kpi_items,
  total_sales,
  sku_prefix,
  ...rest
}: Response.SupplierUser): Supplier => ({
  ...transformUserData(user),
  companyName: company_name,
  additionalPhoneNumber: additional_phone_number,
  productsQuantity: products_quantity,
  registeredNumber: registered_id,
  website: webpage_link,
  KPIs: kpi_items ?? [],
  totalSales: total_sales,
  skuPrefix: sku_prefix,
  ...rest,
});

export const SupplierUsersResponse = ({
  count,
  results,
}: Response.SuppliersUsers): GetSuppliersResponsePayload => ({
  count,
  results: map(results, SupplierUser),
});

export const SuppliersList = (suppliers: Response.SupplierUser[]) =>
  suppliers.map(({ company_name, id }) => ({ id, name: company_name }));

export const RoomsListResponse = (rooms: Response.RoomDetails[]) =>
  rooms.map(({ id, name }) => ({ id, name }));

export const AllQuoteComponents = (
  suppliers: Response.ProductQuoteComponents[]
) => suppliers.map(({ product_id }) => ({ product_id }));

export const SuppliersAutoComplete = (suppliers: Response.SupplierUser[]) =>
  suppliers.map(({ company_name, id, user = {} }) => ({
    id,
    companyName: company_name,
    email: user.email,
    phoneNumber: user.phone_number,
  }));

export const ClientsUsersResponse = ({
  count,
  results,
}: Response.ClientsUsers): GetClientsResponsePayload => ({
  count,
  results: map(results, user => ({
    ...transformUserData(user),
    status: isArray(user.status)
      ? user.status.map(
          status => ClientStatus[status as keyof typeof ClientStatus]
        )
      : [ClientStatus[user.status]],
    supplier: user.supplier?.toString(),
    teamMember: user.team_member?.toString(),
  })),
});

export const ClientInfoResponse = (user: Response.ClientInfo): Client => ({
  ...transformUserData(user),
  status: isArray(user.status)
    ? user.status.map(
        status => ClientStatus[status as keyof typeof ClientStatus]
      )
    : [ClientStatus[user.status]],
});

export const ProductAutoComplete = ({
  id,
  english_name,
  supplier,
}: Response.ResponseProduct): Partial<Product> => ({
  supplier: supplier?.company_name,
  id,
  name: english_name,
});

export const ProductsAutoComplete = (
  results: Response.ResponseProduct[]
): Partial<Product>[] => results.map(ProductAutoComplete);

export const ProductsCarousel = ({ results }: Response.Products): Product[] =>
  map(results, transformProduct);

export const SearchProducts = ({
  products,
  sub_categories,
  category,
  suppliers,
  query,
}: Response.SearchResponse): SearchResults => ({
  products: {
    results: map(products.results, transformProduct),
    count: products.count,
  },
  categories: category,
  subCategories: sub_categories,
  suppliers: {
    count: suppliers.count,
    results: map(suppliers.results, SupplierUser),
  },
  query,
});

export const QuoteComponents = ({
  results,
  count,
}: Response.QuoteComponents): { results: QuoteComponent[]; count: number } => ({
  results: map(results, ({ id, quote, product, room }) => ({
    id: id.toString(),
    quoteId: quote.toString(),
    product: transformProduct(product),
    room,
  })),
  count,
});

export const transformProduct = ({
  category,
  sub_category,
  english_name,
  english_description,
  manufacturer,
  original_price,
  created_at,
  supplier,
  ortho_thumbnail,
  thumbnail,
  webpage_link,
  in_stock,
  discount_price,
  back_in_stock_date,
  not_for_sale,
  id,
  media,
  quantity,
  colors,
  price,
  sku,
  sold_quantity,
  total_sales,
  unit_price,
  status,
  size,
  alt_name,
  series,
  tags,
  type,
  msrp,
  modelling_time,
  updated_at,
}: Response.ResponseProduct): Product => ({
  category: category?.name || sub_category?.category?.name || '',
  categoryId: category?.id || sub_category?.category?.id || '',
  categoryHebrewName:
    category?.hebrew_name || sub_category?.category?.hebrew_name || '',
  createdAt: formatDate(created_at, TABLE_DATE_FORMAT),
  subCategory: sub_category?.name,
  subCategoryId: sub_category?.id,
  subCategoryHebrewName: sub_category?.hebrew_name,
  subCategoryAltName: sub_category?.alt_name,
  categoryAltName: category?.alt_name,
  name: english_name,
  description: english_description && removeHtmlTags(english_description),
  manufacture: {
    ...manufacturer,
    country: transformByCountryCode(manufacturer?.country as ISOCode),
  },
  supplier: supplier ? SupplierUser(supplier) : 'NA',
  discount: discount_price,
  costPrice: original_price,
  thumbnail: thumbnail ?? ortho_thumbnail,
  link: webpage_link,
  inStock: in_stock,
  backToStockDate: back_in_stock_date,
  id: id?.toString(),
  media,
  quantity,
  colors: map(colors, color => ({
    id: id?.toString(),
    name: color.name,
    color: color.color_hex,
  })),
  sku,
  status,
  price,
  soldQuantity: sold_quantity,
  totalSales: total_sales,
  unitPrice: unit_price,
  size: typeof size === 'string' ? size : JSON.stringify(size),
  altName: alt_name,
  series,
  webpageLink: webpage_link,
  tags,
  type,
  msrp,
  notForSale: not_for_sale ?? false,
  modellingTime: modelling_time,
  updatedAt: formatDate(updated_at, TABLE_DATE_FORMAT),
});

// supplier
export const PaginatedProducts = ({
  count,
  results,
}: Response.Products): GetSupplierProductsResponse => ({
  count,
  results: map(results, transformProduct),
});

export const SupplierProductsAutoComplete = (
  results: Response.ResponseProduct[]
): Product[] => map(results, transformProduct);

export const onboardingFields = ({
  answers,
  propertyFile,
  quiz,
  preMadeProperty,
  cartData,
  uploadedProperty,
  maxPrice,
  rooms,
  isScan,
}: OnboardingFields) => ({
  answers: answers
    ? (Object.values(answers).filter(Boolean) as number[])
    : undefined,
  property_file: propertyFile,
  quiz,
  pre_made_property: preMadeProperty,
  cart_data: cartData,
  uploaded_property: uploadedProperty,
  max_price: maxPrice,
  scan_home: isScan,
  rooms,
});

export const registerRequest = ({
  firstName,
  lastName,
  phoneNumber,
  password,
  verifyPassword,
  termsAndConditions: _,
  email,
  verifyEmail,
  key,
  answers,
  propertyFile,
  quiz,
  preMadeProperty,
  cartData,
  uploadedProperty,
  maxPrice,
  rooms,
  panorama,
  isScan,
}: RegisterPayload): RegisterRequestPayload => ({
  first_name: firstName,
  last_name: lastName,
  phone_number: phoneNumber,
  password1: password,
  password2: verifyPassword,
  email,
  email2: verifyEmail,
  key,
  answers: answers
    ? (Object.values(answers).filter(Boolean) as number[])
    : undefined,
  property_file: propertyFile,
  pre_made_property: preMadeProperty,
  quiz,
  cart_data: cartData,
  uploaded_property: uploadedProperty,
  max_price: maxPrice,
  rooms,
  scan_home: isScan,
  panorama,
});

export const AddressResponse = ({
  zip_code,
  is_primary,
  id,
  floor,
  apartment_number,
  address_line_1,
  address_line_2,
  state,
  ...rest
}: Response.Address): IAddress => ({
  isPrimary: is_primary,
  zipCode: zip_code ?? '',
  id: id.toString(),
  floor: floor?.toString(),
  apartmentNumber: apartment_number ? apartment_number.toString() : '',
  address_line_1: address_line_1 ?? '',
  address_line_2: address_line_2 ?? '',
  state: state ?? '',
  ...rest,
});

export const Addresses = (addresses: Response.Address[]): IAddress[] =>
  addresses?.map(AddressResponse);

export const SupplierFilterOptions = (
  results: Response.SupplierUser[]
): SupplierOption[] => map(results, SupplierFilterOption);

export const SupplierFilterOption = ({
  company_name,
  id,
}: Response.SupplierUser): SupplierOption => ({
  id,
  name: company_name,
});

export const SupplierInfo = ({
  user,
  webpage_link,
  registered_id,
  company_name,
  additional_phone_number,
  products_quantity,
  categories,
  id,
  logo,
  sku_prefix,
}: Response.SupplierUser): Supplier => ({
  id,
  ...transformUserData(user),
  companyName: company_name,
  additionalPhoneNumber: additional_phone_number,
  productsQuantity: products_quantity,
  registeredNumber: registered_id,
  website: webpage_link,
  KPIs: [],
  categories,
  logo,
  skuPrefix: sku_prefix,
});

export const AddressRequest = ({
  isPrimary,
  elevator,
  zipCode,
  apartmentNumber,
  address_line_1,
  address_line_2,
  ...rest
}: IAddress & { user?: string }): Response.Address =>
  ({
    ...removeEmptyValues({
      zip_code: zipCode ?? '',
      apartment_number: apartmentNumber,
      address_line_1,
      address_line_2,
      ...rest,
    }),
    is_primary: isPrimary,
    elevator,
  } as Response.Address);

export const OrderResponse = ({
  id,
  client,
  created_at,
  status,
  order_details,
  supplier,
  total_price,
  shipping_address,
  tracking_number,
  estimated_date,
  property,
  sub_total,
  vat,
  final_price,
  shipping_date,
  discount,
}: Response.ResponseOrder): Order => ({
  id: id?.toString(),
  client: transformBaseUserData(client),
  createdAt: formatDate(created_at, TABLE_DATE_FORMAT),
  shippingEst: formatDate(estimated_date, TABLE_DATE_FORMAT),
  supplier: typeof supplier === 'number' ? supplier : SupplierInfo(supplier),
  products: OrderDetails(order_details),
  status:
    OrderStatus[status as keyof typeof OrderStatus] ||
    SupplierOrderStatus[status as keyof typeof SupplierOrderStatus],
  amount: parseFloat(total_price?.toString()),
  shippingAddress: shipping_address && AddressResponse(shipping_address),
  trackingNumber: tracking_number,
  property,
  subTotal: sub_total,
  vat,
  finalPrice: final_price,
  shippingDate: shipping_date,
  discount,
});

export const Orders = ({
  results,
  count,
  total_money_spent,
  purchased_products,
}: Response.Orders): GetOrdersDataResponsePayload => ({
  count,
  results: map(results, OrderResponse),
  total_money_spent,
  purchased_products,
});

export const OrderDetailResponse = ({
  id,
  product,
  created_at,
  quantity,
  shipping_address,
  estimated_date,
  unit_price,
  total_row,
  order_id,
  status,
  sub_total,
  vat,
  final_price,
}: Response.OrderDetail): OrderDetail => ({
  orderDetailsId: id?.toString(),
  orderId: order_id?.toString(),
  ...transformProduct(product),
  createdAt: formatDate(created_at),
  quantity,
  shippingAddress: shipping_address
    ? AddressResponse(shipping_address)
    : undefined,
  shippingEst: estimated_date,
  status,
  unitPrice: unit_price,
  totalRowPrice: unit_price,
  subTotal: sub_total,
  vat,
  finalPrice: final_price,
});

export const OrderAutoComplete = ({
  id,
  client,
  shipping_address,
}: Response.ResponseOrder): OrderAutoCompleteType => ({
  id: id?.toString(),
  client: transformBaseUserData(client),
  shippingAddress: shipping_address && AddressResponse(shipping_address),
});

export const OrderAutoCompleteResponse = (
  results: Response.ResponseOrder[]
): OrderAutoCompleteType[] => map(results, OrderAutoComplete);

export const OrderDetails = (results: Response.OrderDetail[]): OrderDetail[] =>
  map(results, OrderDetailResponse);

export const PaginatedOrderDetail = ({
  count,
  results,
}: Response.ClientProducts): GetProductsDataResponsePayload => ({
  count,
  results: OrderDetails(results),
});

export const Roles = (roles: Response.Role[]): RoleInfo[] =>
  map(roles, ({ id, name, permissions, department }) => ({
    id: id.toString(),
    name,
    roleType: isArray(permissions)
      ? permissions.map(
          roleType => RolePermission[roleType as keyof typeof RolePermission]
        )
      : [RolePermission[permissions]],
    department,
  }));

export const RolesResponse = ({
  results,
  count,
}: Response.Roles): GetRolesDataResponsePayload => ({
  count,
  results: Roles(results),
});

export const AddTeamPatriciaUserRequest = ({
  firstName,
  lastName,
  phoneNumber,
  zipCode,
  apartmentNumber,
  profilePicture,
  ...rest
}: AddTeamPatriciaUserPayload): Response.BaseUserForm => ({
  first_name: firstName,
  last_name: lastName,
  phone_number: phoneNumber,
  zip_code: zipCode,
  apartment_number: apartmentNumber ? parseInt(apartmentNumber, 10) : undefined,
  profile_picture: profilePicture,
  ...rest,
});

export const registerKeyResponse = ({
  first_name,
  last_name,
  email,
  phone_number,
}: Response.RegisterKey): RegisterPayload => ({
  firstName: first_name,
  lastName: last_name,
  email,
  verifyEmail: email,
  phoneNumber: phone_number,
  password: '',
  verifyPassword: '',
  termsAndConditions: false,
});

export const AddSupplierUserRequest = ({
  phoneNumber,
  firstName,
  lastName,
  additionalPhoneNumber,
  companyName,
  zipCode,
  registeredNumber,
  website,
  category,
  profilePicture,
  logo,
  skuPrefix,
  ...payload
}: AddSupplierDataPayload) => ({
  ...removeEmptyValues({
    first_name: firstName,
    last_name: lastName,
    phone_number: isEmpty(phoneNumber)
      ? undefined
      : prefixPhoneNumber(phoneNumber),
    additional_phone_number: additionalPhoneNumber
      ? prefixPhoneNumber(additionalPhoneNumber)
      : undefined,
    company_name: companyName,
    zip_code: zipCode,
    registered_id: registeredNumber,
    webpage_link: website,
    categories: [category],
    ...payload,
    type: 'SUPPLIER',
  }),
  sku_prefix: skuPrefix.toLocaleUpperCase(),
  logo: logo === '' ? null : logo,
  profile_picture: profilePicture === '' ? null : profilePicture,
});

export const ProductRequest = ({
  englishName,
  manufacturer,
  sku,
  subCategory,
  quantity,
  mediaUrls,
  media,
  description,
  msrp,
  price,
  length,
  width,
  height,
  measurementUnits,
  type,
  series,
  tags,
  color,
  webpageLink,
  specification,
  ...payload
}: ProductDataPayload) => ({
  ...removeEmptyValues({
    english_name: englishName,
    manufacturer,
    sku,
    sub_category: subCategory,
    quantity,
    media_Urls: mediaUrls,
    media,
    description,
    msrp,
    price,
    length,
    width,
    height,
    measurement_Units: measurementUnits,
    type,
    series,
    tags,
    color,
    web_page_link: webpageLink,
    specification,
    ...payload,
  }),
});

export const QuizResponse = ({
  id,
  name,
  design_styles,
  owner,
  created_at,
  is_primary,
  questions,
  question_count,
  countries,
}: Response.Quiz): Quiz => ({
  id: id?.toString(),
  designStyles: design_styles?.map(design => ({
    id: design?.id.toString(),
    name: design?.name,
  })),
  name,
  createdAt: formatDate(created_at, TABLE_DATE_FORMAT),
  isPrimary: is_primary,
  createdBy: transformHandler(owner),
  questionCount: question_count,
  countries,
  questions: questions
    ? map(questions, ({ id: questionId, question, answers }) => ({
        id: questionId.toString(),
        questionLabel: question,
        answers: answers
          ? map(
              answers,
              ({
                id: answerId,
                answer,
                color_tag,
                design_style,
                price_tag,
                tags,
                panorama,
              }) => ({
                id: answerId?.toString(),
                image: {
                  id: (answer as MediaFile)?.id.toString(),
                  file: (answer as MediaFile)?.file,
                },
                color: {
                  id: (color_tag as Response.Color)?.id.toString(),
                  name: (color_tag as Response.Color)?.name,
                  color: (color_tag as Response.Color)?.color_hex,
                },
                priceTag: capitalize(price_tag) ?? NO_VALUE,
                tags,
                designStyle: {
                  id: (design_style as Response.DesignStyle)?.id.toString(),
                  name: (design_style as Response.DesignStyle)?.name,
                },
                panorama,
              })
            )
          : [],
      }))
    : [],
});

export const Quizzes = ({
  results,
  count,
}: Response.Quizzes): GetQuizzesDataResponsePayload => ({
  count,
  results: map(results, QuizResponse),
});

export const addNewQuizRequest = ({
  id,
  name,
  designStyles,
  countries,
}: typeof preferencesDefaultValues) =>
  removeEmptyValues({
    id,
    name,
    design_styles: designStyles.map(style => style.id),
    countries: countries.map(e => e.value),
  });

const appendQuizAnswers = (
  answers: Omit<QuizAnswer, 'id'>[]
): Omit<Response.QuizAnswer, 'id'>[] =>
  answers.map(({ priceTag, designStyle, color, image, tags, panorama }) => ({
    price_tag: priceTag as Response.PriceTagResponse,
    design_style: parseInt((designStyle as string) ?? '0', 10),
    color_tag: +color,
    answer: image as string,
    tags,
    panorama,
  }));

export const addQuizQuestionRequest = ({
  id: quizId,
  questionLabel,
  answers,
}: QuizQuestion): Omit<Response.QuizQuestion, 'id'> & { quiz: number } => ({
  quiz: parseInt(quizId ?? '0', 10),
  question: questionLabel,
  answers: appendQuizAnswers(answers),
});

export const quizResult = ({
  id,
  quiz,
  result,
  properties,
  created_at,
  updated_at,
}: Response.QuizResult): QuizResult => ({
  id: id?.toString(),
  properties: map(properties, propertyItem => ({
    id: propertyItem.id?.toString(),
    name: propertyItem.name,
    link: propertyItem.link,
  })),
  quizId: quiz?.id?.toString(),
  quizName: quiz?.name,
  designStyle: result
    ? {
        id: result?.id?.toString(),
        name: result.name,
        image: result?.image,
      }
    : null,
  createdAt: formatDate(created_at, CLIENT_DATE_FORMAT),
  updatedAt: formatDate(updated_at, CLIENT_DATE_FORMAT),
});

export const quizResults = (results: Response.QuizResult[]): QuizResult[] =>
  results.map(quizResult);

export const paginatedQuizResults = ({
  results,
}: {
  results: Response.QuizResult[];
}): QuizResult[] => results.map(quizResult);

export const myQuizzes = (results: Response.QuizResult[]): QuizResult[] =>
  results.reduce(
    (currentResults: QuizResult[], nextResult) => [
      ...currentResults,
      ...(isEmpty(nextResult.properties)
        ? [quizResult(nextResult)]
        : nextResult.properties.map(property =>
            quizResult({ ...nextResult, properties: [property] })
          )),
    ],
    []
  );

export const ClientQuizzesResponse = ({
  results,
  count,
}: Response.QuizResults): GetQuizResultsDataResponsePayload => ({
  count,
  results: map(results, quizResult),
});

export const PropertyAutoComplete = ({
  id,
  name,
}: Response.Property): { id: number; name: string } => ({
  id,
  name,
});
export const transformProperty = ({
  id: propertyId,
  name,
  owner,
  link,
  created_at,
  media,
  quiz_result,
  updated_at,
  status,
  unit,
  co_owners,
}: Response.Property): Property => ({
  id: propertyId?.toString(),
  name,
  createdAt: formatDate(created_at, TABLE_DATE_FORMAT),
  link,
  media: media?.map(item => ({
    ...item,
    type:
      PropertyMediaType[
        (item.type as unknown) as keyof typeof PropertyMediaType
      ],
    metadata:
      item.metadata && typeof item.metadata === 'string'
        ? JSON.parse(item.metadata)
        : item.metadata,
  })),
  owner: owner
    ? {
        id: owner.id.toString(),
        firstName: owner.first_name,
        lastName: owner.last_name,
      }
    : null,
  quizResult: quiz_result
    ? {
        id: quiz_result.id.toString(),
        quizId: quiz_result.quiz?.id.toString() as string,
        quizName: quiz_result.quiz?.name as string,
        createdAt: formatDate(quiz_result.quiz?.created_at, CLIENT_DATE_FORMAT),
        designStyle: {
          id: quiz_result.result?.id.toString(),
          name: quiz_result.result.name,
        },
        updatedAt: quiz_result.updated_at,
      }
    : undefined,
  updatedAt: formatDate(updated_at, CLIENT_DATE_FORMAT),
  co_owner: co_owners,
  status,
  unit,
});

export const mapProperties = (results: Response.Property[]) =>
  map(results, result => ({
    ...transformProperty(result),
    createdAt: formatDate(result.created_at, CLIENT_DATE_FORMAT),
  }));

export const Properties = ({
  results,
  count,
}: Response.Properties): GetPropertiesDataResponsePayload => ({
  count,
  results: map(results, transformProperty),
});

export const getQuizPreferences = ({
  id,
  name,
  design_styles,
  countries,
}: Response.Quiz): typeof preferencesDefaultValues => ({
  id: id.toString(),
  name,
  designStyles: design_styles.map(style => ({
    id: style.id.toString(),
    name: style.name,
  })),
  countries,
});

export const ManageTasks = ({ count, results }: Response.NewTasks) => ({
  count,
  results: map(
    results,
    ({
      owner,
      assignee,
      created_at,
      files,
      ...all
    }: PropertyTaskResponse): PropertyTask => ({
      owner: transformBaseUserData(owner ?? {}),
      assignee: transformHandler(assignee),
      createdAt: created_at,
      files: files?.map(item => ({
        ...item,
        type:
          PropertyMediaType[
            (item.type as unknown) as keyof typeof PropertyMediaType
          ],
      })),
      ...all,
    })
  ),
});

export const PublishedTasks = ({
  count,
  results,
}: Response.PublishedTasks) => ({
  count,
  results: map(
    results,
    ({
      owner,
      assignee,
      time_published,
      publish_duration,
      ...all
    }: PublishedPropertyTaskResponse): PublishedPropertyTask => ({
      owner: transformBaseUserData(owner ?? {}),
      time_published: formatDate(time_published, TABLE_TIME_FORMAT),
      publish_duration: formatTime(publish_duration),
      assignee: transformHandler(assignee),
      ...all,
    })
  ),
});

export const ArchivedTasks = ({ count, results }: Response.ArchivedTasks) => ({
  count,
  results: map(
    results,
    ({
      owner,
      assignee,
      archived_date,
      archive_duration,
      media,
      ...all
    }: ArchivedPropertyTaskResponse): ArchivedPropertyTask => ({
      owner: transformBaseUserData(owner ?? {}),
      archived_date: formatDate(archived_date, TABLE_TIME_FORMAT),
      archive_duration: formatTime(archive_duration),
      assignee: transformHandler(assignee),
      media: media?.map(item => ({
        ...item,
        type:
          PropertyMediaType[
            (item.type as unknown) as keyof typeof PropertyMediaType
          ],
      })),
      ...all,
    })
  ),
});

export const ThreeDAllTasks = ({
  count,
  results,
}: Response.ThreeDAllTasks): Get3DTasksDataResponsePayload => ({
  count,
  results: map(
    results,
    ({ assignee, ...product }: Response.ThreeDProducts) => ({
      assignee: transformHandler(assignee),
      ...transformProduct(product),
      status:
        (getEnumKeyByValue(ThreeDTasksStatus).get(
          product.status
        ) as ProductStatus) ?? 'Raw data',
    })
  ),
});

export const ThreeDInDb = ({
  count,
  results,
}: Response.ThreeDInDb): Get3DInDbDataResponsePayload => ({
  count,
  results: map(
    results,
    ({ assignee, ...product }: Response.ThreeDProducts) => ({
      assignee: transformHandler(assignee),
      ...transformProduct(product),
    })
  ),
});

export const FileTaskResponse = ({
  id,
  task_id,
  missing_data_file,
  file: _,
  file_name,
  missing_data,
  status,
  ...rest
}: Response.ResponseFile): FileTask => ({
  id: id.toString(),
  taskId: task_id,
  file: missing_data_file ?? NO_VALUE,
  fileName: file_name ?? NO_VALUE,
  missingData: missing_data,
  missingDataFile: missing_data_file ?? NO_VALUE,
  status: getEnumKeyByValue(FileStatus).get(status) as FileStatus,
  ...rest,
});

export const FileTasks = ({
  count,
  results,
}: Response.FileTasks): GetFilesDataResponsePayload => ({
  count,
  results: map(results, FileTaskResponse),
});

// @CLIENT

export const clientOrder = ({
  created_at,
  estimated_date,
  client,
  id,
  order_details,
  shipping_date,
  shipping_address,
  status,
  total_price,
  tracking_number,
  delivery_date,
  supplier,
  property,
  sub_total,
  discount,
  vat,
  final_price,
}: Response.ResponseOrder): Order => ({
  id: id?.toString(),
  createdAt: created_at,
  client: client
    ? {
        userID: client.id?.toString(),
        email: client.email,
        firstName: client.first_name,
        lastName: client.last_name,
        phoneNumber: client.phone_number,
      }
    : undefined,
  shippingEst: estimated_date,
  shippingDate: shipping_date,
  deliveryDate: delivery_date,
  totalPrice: total_price,
  shippingAddress: shipping_address ? AddressResponse(shipping_address) : null,
  trackingNumber: tracking_number,
  amount: total_price,
  products: order_details ? OrderDetails(order_details) : [],
  status: OrderStatus[status as keyof typeof OrderStatus],
  property,
  subTotal: sub_total,
  vat,
  discount,
  finalPrice: final_price,
  supplier:
    supplier && !isNumber(supplier) ? SupplierUser(supplier) : undefined,
});

export const clientOrderList = (orders: Response.ResponseOrder[]) =>
  orders?.map(clientOrder);

export const singleProjectDetails = (
  project: Response.ResponseProjectDetail
): ProjectDetail => ({
  id: project.id.toString(),
  unitFile: project.unit_file,
  projectName: project.name,
  street: project?.address?.street,
  number: project.number,
  city: project?.address?.city,
  developerDetails: {
    name: project?.developer?.name,
    logo: project?.developer?.logo,
    id: project?.developer?.id,
  },
  propertyCount: project.property_count,
  coverPhoto: project?.cover_photo,

  types: map(project?.units, unit => ({
    id: unit.id,
    building: unit.building,
    coverPhoto: unit.cover_photo,
    floorPlan: unit.floor_plan,
    type: unit.type,
    propertyCount: unit.property_count,
  })),
});

export const transformCartItemList = (
  cartItems: Response.CartItem[]
): CartItem[] => cartItems.map(e => transformCartItem(e));

export const transformCartItem = ({
  id,
  product,
  quantity,
  checkout_quantity,
}: Response.CartItem): CartItem => ({
  id: id.toString(),
  checkoutQuantity: checkout_quantity ?? 0,
  product: {
    id: product?.id.toString(),
    altName: product?.alt_name,
    colors: product.colors.map(color => ({
      id: color.id.toString(),
      name: color.name,
      color: color.color_hex,
    })),
    englishName: product?.english_name,
    sku: product?.sku,
    thumbnail: {
      id: product?.thumbnail?.id.toString(),
      file: product?.thumbnail?.file,
    },
    quantity: product?.quantity,
    originalPrice: product?.original_price,
    finalPrice: product?.final_price,
    technicalInfo: product?.technical_info,
    supplier: {
      id: product?.supplier?.id.toString(),
      companyName: product.supplier?.company_name,
      logo: product?.supplier?.logo,
    },
    subCategory: {
      hebrewName:
        product?.sub_category?.alt_name ?? product?.sub_category?.name,
      id: product?.sub_category?.id ?? '',
      name: product?.sub_category?.name ?? '',
    },
    notForSale: product?.not_for_sale,
  },
  quantity,
});

export const transformCart = (cart: Response.Cart): Cart => ({
  items: (cart.shopping_cart_items ?? []).map(item =>
    typeof item !== 'number' ? transformCartItem(item) : item
  ),
  subTotal: cart.sub_total,
  vat: cart.vat,
  finalPrice: cart.final_price,
  taxRate: (cart?.tax_rate ?? 0) * 100,
});

export const transformPaginatedCart = (
  cart: Response.PaginatedCart
): PaginatedCart => ({
  count: cart.count,
  results: (cart.results ?? []).map(item =>
    typeof item !== 'number' ? transformCartItem(item) : item
  ),
  subTotal: cart.sub_total,
  vat: cart.vat,
  finalPrice: cart.final_price,
  taxRate: (cart?.tax_rate ?? 0) * 100,
  // count,
});

export const propertyCarts = (carts: Response.Cart[] | null): Cart[] =>
  (carts ?? []).map(transformCart);

export const DesignStyleRoomSubCategory = ({
  id,
  sub_category,
  thumbnail,
  products,
  products_count,
}: Response.DesignStyleRoomSubCategory): DesignStyleRoomSubcategory => ({
  id: id?.toString(),
  name: sub_category?.name,
  thumbnail,
  products: products?.map(transformProduct),
  productsCount: products_count,
});

export const designStyleRoom = ({
  room,
  sub_categories_count,
  design_style_room_sub_categories,
  products_count,
  ...rest
}: Response.DesignStyleRoom): DesignStyleRoom => ({
  id: rest.id.toString(),
  room: { id: room.id.toString(), name: room.name },
  subCategories: design_style_room_sub_categories?.map(
    DesignStyleRoomSubCategory
  ),
  categoriesCount: sub_categories_count,
  productsCount: products_count,
});

export const designStyle = ({
  id,
  name,
  created_at,
  products_count,
  quizzes,
  user,
  design_style_rooms,
  countries,
}: Response.DesignStyle): DesignStyle => ({
  id: id.toString(),
  name,
  createdAt: formatDate(created_at, TABLE_DATE_FORMAT),
  productsCount: products_count,
  rooms: design_style_rooms?.map(designStyleRoom),
  quizzes:
    quizzes?.map(quiz => ({
      id: quiz.id.toString(),
      name: quiz.name,
      createdAt: formatDate(quiz.created_at),
    })) ?? [],
  user: user
    ? {
        userID: user.id.toString(),
        firstName: user.first_name,
        lastName: user.last_name,
      }
    : undefined,
  countries,
});

export const designStyles = ({
  count,
  results,
}: Response.DesignStyles): GetDesignStylesDataResponsePayload => ({
  count,
  results: map(results, designStyle),
});

export const checkoutCart = ({
  id,
  address,
  final_price,
  vat,
  sub_total,
  total_discount,
  total_price,
  items,
  coupon,
  hs,
  tax_rate,
}: Response.CheckoutCart): CheckoutCart => ({
  id: id.toString(),
  address: address ? AddressResponse(address) : null,
  finalPrice: final_price,
  items: items.map(e => transformCartItem(e)),
  vat,
  subTotal: sub_total,
  totalDiscount: total_discount,
  totalPrice: total_price,
  coupon,
  hs,
  taxRate: tax_rate * 100,
});

export const addToCartBulkProductAdd = (data: BulkAddToCartProduct[]) =>
  data.map(item => ({
    product: item.product,
    quantity: item.quantity,
    checkout_quantity: item.checkoutQuantity,
  }));

export const activity = ({
  id,
  description,
  created_at,
}: Response.Activity) => ({
  id: id?.toString(),
  description,
  createdAt: created_at,
});

export const userActivities = (
  response: Response.UserActivities | null
): UserActivities => ({
  id: response?.id?.toString() ?? '',
  user: response?.user?.toString() ?? '',
  activities: response?.activities?.map(activity) ?? [],
});

export const paginatedUserLogs = ({
  count,
  results,
}: Response.PaginatedLogs): GetUserLogsResponsePayload => ({
  count,
  results: userLogs(results),
});

export const userLogs = (
  activities: Response.UserLogs[] | null
): UserLogType[] =>
  (activities ?? []).map(e => ({
    name: e.name,
    area: e.area,
    section: e.section,
    path: e.path,
    action: e.action,
    metadata: e.metadata,
    user: e.user,
    id: e.id,
    createdAt: formatDate(e.created_at),
  }));

export const usersActivities = (
  activities: Response.UserActivities[] | null
): UserActivities[] => (activities ?? []).map(userActivities);

const chipCostStyle = (price: number, country: string) => {
  const val = Math.floor(price / 1000) * 1000;

  let min: number = 0;
  let max: number = 10;
  if (val >= 0 && val < 1000) {
    min = 0;
    max = 10;
  } else if (val >= 1000 && val < 25000) {
    min = 10;
    max = 25;
  } else if (val >= 25000 && val < 100000) {
    min = 25;
    max = 100;
  } else if (val >= 100) {
    return `${toCurrencyString({
      value: 100,
      country,
      maximumFractionDigits: 2,
      minimumFractionDigits: 0,
    })}K +`;
  }

  return `${toCurrencyString({
    value: min,
    country,
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  })} - ${toCurrencyString({
    value: max,
    country,
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  })}K`;
};

const chipButtonColor = (skin_category: string) => {
  switch (skin_category) {
    case SkinCategory.ASIAN:
      return '#D33E43';
    case SkinCategory.CONTEMPORARY:
      return '#AEE241';
    case SkinCategory.ECLECTIC:
      return '#CACE00';
    case SkinCategory.INDUSTRIAL:
      return '#9000B3';
    case SkinCategory.MEDITERRANEAN:
      return '#6A00F0';
    case SkinCategory.MIDCENTURY:
      return '#0032B3';
    case SkinCategory.MODERN:
      return '#00CECB';
    case SkinCategory.RUSTIC:
      return '#4178E2';
    case SkinCategory.SCANDINAVIAN:
      return '#F08700';
    case SkinCategory.CLASSIC:
      return '#CE0063';
    case SkinCategory.NORDIC:
      return '#B33600';
    case SkinCategory.SOUTHWESTERN:
      return '#CE0063';
    case SkinCategory.TRADITIONAL:
      return '#CE0063';
    case SkinCategory.TRANSITIONAL:
      return '#CE0063';
    case SkinCategory.TROPICAL:
      return '#CE0063';
    case SkinCategory.VICTORIAN:
      return '#CE0063';
    case SkinCategory.CRAFTSMAN:
      return '#CE0063';
    case SkinCategory.BEACH_STYLE:
      return '#CE0063';
    case SkinCategory.FARMHOUSE:
      return '#CE0063';
    default:
      return '#CE0063';
  }
};

export const skin = ({
  is_public,
  skin_category,
  price_range,
  rooms,
  number_of_downloads,
  is_locked,
  is_popular,
  sub_total,
  final_price,
  desktop_thumbnail,
  mobile_thumbnail,
  user,
  ...rest
}: Response.Skin): Skin => ({
  isPublic: is_public,
  downloadCount: number_of_downloads,
  skinCategory: skin_category,
  priceRange: price_range,
  isLocked: is_locked,
  finalPrice: final_price,
  subTotal: sub_total,
  isPopular: Boolean(is_popular),
  rooms: rooms?.map(({ id, room_id, room_name, sub_categories }) => ({
    id,
    roomId: room_id,
    name: room_name,
    subCategories: sub_categories?.map(sub_category => ({
      id: sub_category.id,
      subCategoryId: sub_category.sub_category_id,
      name: sub_category.name,
      product:
        sub_category.products && transformProduct(sub_category.products[0]),
    })),
  })),
  chipsData: {
    style: skin_category,
    room: rest?.color?.name ?? '',
    cost: chipCostStyle(rest?.budget, rest.country),
    color: chipButtonColor(skin_category),
  },
  createdAt: formatDate(rest?.created_at, 'dd-MM-yyyy'),
  desktopThumbnail: desktop_thumbnail,
  mobileThumbnail: mobile_thumbnail,
  user: {
    id: user.id,
    name: user.name,
    link: user?.link,
    rating: user?.rating,
    skinCreator: {
      id: user?.skin_creator?.id,
      description: user?.skin_creator?.description,
      logo: user?.skin_creator?.logo,
      name: user?.skin_creator?.name,
      skinImages: user?.skin_creator?.skin_images,
    },
  },
  ...rest,
});

export const prodcutCoin = ({
  id,
  type,
  alt_name,
  english_name,
  quantity,
  original_price,
  final_price,
  price,
}: Response.ProductCoin): ProductCoin => ({
  id,
  type,
  altName: alt_name,
  englishName: english_name,
  originalPrice: original_price,
  finalPrice: final_price,
  price,
  quantity,
});

export const skins = (results: Response.Skin[]): Skin[] => results.map(skin);

export const transformSkinsPaginatedWithCount = (
  response: Response.Skins
): PaginatedSkin => ({
  results: response.results.map(skin),
  count: response.count,
});

export const transformSkinsPaginated = (response: Response.Skins): Skin[] =>
  response.results.map(skin);

export const transformProductCoinPaginated = (
  response: Response.ProductCoins
): ProductCoin[] => response.results.map(prodcutCoin);

export const storySections = (response: Response.Stories[]): Stories[] =>
  response.map(storieObj);

export const storieObj = ({
  story_section_title,
  stories,
}: Response.Stories): Stories => ({
  storySectionTitle: story_section_title,
  stories: map(stories, story),
});

export const story = ({
  file,
  type,
  story_order,
  duration,
}: Response.Story): Story => ({
  url: file,
  type,
  duration,
  storyOrder: story_order,
});

export const supplierStatisticsData = (
  res: Response.SupplierStatisticsResponse
): SupplierStatisticsResponse => ({
  orders: res.orders,
  ordersCount: res.orders_count,
  income: res.income,
  soldProducts: res.sold_products,
  totalProducts: res.total_products,
  totalProfit: res.total_profit,
});

export const ideaDetailsData = (res: Response.IdeasDetails): IdeasDetails => ({
  id: res?.id,
  name: res?.name,
  file: res?.file,
  metadata: res?.metadata,
  type: res?.type,
  created_at: formatDate(res?.created_at, 'dd-MM-yy'),
  property: res?.property,
  products: res.products ? res.products?.map(transformProduct) : undefined,
  user: res?.user
    ? {
        id: res?.user?.id,
        first_name: res?.user?.first_name,
        last_name: res?.user?.last_name,
        profile_picture: res?.user?.profile_picture,
      }
    : null,
  viewCount: (res?.view_count ?? 0).toLocaleString('en-US'),
});

export const bgDetailsData = (
  res: Response.BackgroundTask
): BackgroundTask => ({
  id: res.id,
  progress: res.progress,
  status: res.status,
  completedAt: res.completed_at,
  startedAt: res?.started_at,
  result: res?.result,
  file: res?.file_results?.[0]?.file ?? null,
});

export const ideaList = (res: Response.IdeasDetails[]): IdeasDetails[] =>
  res?.map(ideaDetailsData);
