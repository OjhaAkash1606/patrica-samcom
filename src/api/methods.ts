import * as Response from 'api/responses';
import * as Transform from 'api/transform';
import * as AuthPayload from 'store/types/authentication.types';
import {
  GetUsersDataParams as SuppliersParams,
  GetProductsDataParams as SupplierProductParams,
} from 'store/types/user-management/suppliers.types';
import {
  GetRolesDataParams,
  GetUsersDataParams as TeamPatriciaUsersParams,
  AddUserDataRequestPayload as AddTeamPatriciaUserPayload,
} from 'store/types/user-management/teamPatricia.types';
import { GetOrdersDataParams } from 'store/types/user-management/orders.types';
import {
  GetUsersDataParams as ClientsParams,
  GetProductsDataParams as ClientProductsParams,
  GetQuizResultsDataParams,
  UserLogType,
  GetUserActivityRequestPayload,
} from 'store/types/user-management/clients.types';
import { GetQuizzesDataParams } from 'store/types/quizManagement.types';
import { Client } from 'types/clients';
import { GetNewTaskDataParams } from 'store/types/properties-management/PropertiesManagement.types';
import { GetPropertiesDataParams } from 'store/types/user-management/properties.types';
import {
  Get3DTasksDataParams,
  Get3DInDbDataParams,
} from 'store/types/3d-content-management/threeD.types';
import { GetFilesDataParams } from 'store/types/suppliers-interface/database.types';
import { GetDesignStylesDataParams } from 'store/types/designStyles.types';
import { GetPublishedTaskDataParams } from 'store/types/properties-management/PublishedProperties.types';
import { GetArchivedTaskDataParams } from 'store/types/properties-management/ArchivedProperties.types';
import { ThreeDTasksStatus } from 'types/products';
import { AUTH_CONFIG_ROOT_KEY } from 'constants/localstorage.constants';
import { getLocalStorage } from 'utils/common.utils';
import { Cart } from 'types/properties';
import client, { METHODS } from 'api/client';

// eslint-disable-next-line
const myWindow: any = window;
export const AuthAPI = {
  login: (
    data: AuthPayload.LoginPayload
  ): Promise<AuthPayload.AccountPayload> =>
    client<Response.Authentication>({ url: '/api/auth/login/', data }).then(
      Transform.AuthResponse
    ),
  loginWithProvider: (
    data: AuthPayload.LoginWithProviderPayload
  ): Promise<AuthPayload.AccountPayload> => {
    type TokenType = {
      user?: {
        email: string;
        name: { firstName: string; lastName: string };
      };
    };
    const appleObj = (data.token as TokenType).user?.email
      ? {
          user: {
            email: (data.token as TokenType).user?.email,
            firstName: (data.token as {
              user?: {
                email: string;
                name: { firstName: string; lastName: string };
              };
            }).user?.name.firstName,
            lastName: (data.token as {
              user?: { name: { firstName: string; lastName: string } };
            }).user?.name.lastName,
          },
        }
      : null;

    if (data.backend === 'google-oauth2')
      return client<Response.Authentication>({
        url: '/api/social/google/auth/',
        data: {
          auth_token: data.token,
          ...data.onboardingFields,
          pre_made_property:
            data.onboardingFields?.preMadeProperty ?? undefined,
          property_file: data.onboardingFields?.propertyFile ?? undefined,
          quiz: data.onboardingFields?.quiz,
          answers: data.onboardingFields?.answers,
        },
      }).then(Transform.AuthResponse);
    // console.log('data', data);
    if (data.backend === 'facebook')
      return client<Response.Authentication>({
        url: '/api/social/facebook/auth/',
        data: {
          auth_token: data.token,
          // ...data.onboardingFields,
          pre_made_property:
            data.onboardingFields?.preMadeProperty ?? undefined,
          property_file: data.onboardingFields?.propertyFile ?? undefined,
          quiz: data.onboardingFields?.quiz,
          answers: data.onboardingFields?.answers,
        },
      }).then(Transform.AuthResponse);
    return client<Response.Authentication>({
      url: '/api/social/apple/auth/',
      data: {
        authorization: (data.token as {
          authorization: { id_token: string; code: string };
        }).authorization,
        ...appleObj,
        ...data.onboardingFields,
        pre_made_property: data.onboardingFields?.preMadeProperty ?? undefined,
        property_file: data.onboardingFields?.propertyFile ?? undefined,
        quiz: data.onboardingFields?.quiz,
        answers: data.onboardingFields?.answers,
      },
    }).then(Transform.AuthResponse);
  },
  verifyToken: (
    data: AuthPayload.VerifyTokenPayload
  ): Promise<AuthPayload.AccountPayload> =>
    client<Response.Authentication>({
      url: '/api/auth/verify_token/',
      data,
    }).then(Transform.AuthResponse),
  register: (
    data: AuthPayload.RegisterPayload
  ): Promise<AuthPayload.AccountPayload> =>
    client<Response.Authentication>({
      url: '/api/auth/signup/',
      data: Transform.registerRequest(data),
    }).then(Transform.AuthResponse),
  resetLink: (data: AuthPayload.ForgotPasswordPayload): Promise<void> =>
    client<void>({
      url: '/api/auth/password/reset/',
      method: METHODS.POST,
      data,
    }),
  validateResetToken: (
    data: AuthPayload.ValidateResetTokenPayload
  ): Promise<void> =>
    client<void>({
      url: '/api/auth/password/reset/validate_token/',
      method: METHODS.POST,
      data,
    }),
  resetPassword: (data: AuthPayload.ResetPasswordPayload): Promise<void> =>
    client<void>({
      url: '/api/auth/password/reset/confirm/',
      method: METHODS.POST,
      data,
    }),
};

export const TeamPatriciaAPI = {
  getTeamPatriciaUsers: ({ params }: TeamPatriciaUsersParams) =>
    client<Response.PatriciaUsers>({
      url: '/api/team_members/',
      params,
      method: METHODS.GET,
    }).then(Transform.PatriciaUsersResponse),
  addTeamPatriciaUser: (data: AddTeamPatriciaUserPayload) =>
    client<void>({
      url: '/api/invites/',
      data: Transform.AddTeamPatriciaUserRequest(data),
      method: METHODS.POST,
    }),
};

export const ClientsAPI = {
  getClientsUsers: ({ params }: ClientsParams) =>
    client<Response.ClientsUsers>({
      url: '/api/users/',
      params,
      method: METHODS.GET,
    }).then(Transform.ClientsUsersResponse),

  getClientProducts: ({ params }: ClientProductsParams) =>
    client<Response.ClientProducts>({
      url: '/api/order_details/',
      params,
      method: METHODS.GET,
    }).then(Transform.PaginatedOrderDetail),

  getClientInfo: (id: string): Promise<Client> =>
    client<Response.ClientInfo>({
      url: `/api/users/${id}/`,
      method: METHODS.GET,
    }).then(Transform.ClientInfoResponse),
  getClientActivities: (params: GetUserActivityRequestPayload) =>
    client<Response.PaginatedLogs>({
      url: `/api/user_logs/`,
      params,
      method: METHODS.GET,
    }).then(Transform.paginatedUserLogs),
  getCartItems: (id: string): Promise<Cart> =>
    client<Response.Cart>({
      url: `/api/shopping_cart_item/?user=${id}`,
      method: METHODS.GET,
    }).then(Transform.transformCart),
  getRooms: () =>
    client<Response.RoomDetails[]>({
      url: '/api/rooms/',
      method: METHODS.GET,
    }).then(Transform.RoomsListResponse),
};

export const SuppliersAPI = {
  getSuppliersUsers: ({ params }: SuppliersParams) =>
    client<Response.SuppliersUsers>({
      url: '/api/suppliers/',
      params,
      method: METHODS.GET,
    }).then(Transform.SupplierUsersResponse),
  getSupplierInfo: (id: string) =>
    client<Response.SupplierUser>({
      url: `/api/suppliers/${id}/`,
      method: METHODS.GET,
    }).then(Transform.SupplierInfo),

  getSupplierProducts: ({ params }: SupplierProductParams) =>
    client<Response.Products>({
      url: '/api/products/',
      params,
      method: METHODS.GET,
    }).then(Transform.PaginatedProducts),
  getSupplierFileTasks: ({ params }: GetFilesDataParams) =>
    client<Response.FileTasks>({
      url: 'api/async_tasks/',
      params,
      method: METHODS.GET,
    }).then(Transform.FileTasks),
  getStatistics: (id: string) =>
    client<Response.SupplierStatisticsResponse>({
      url: `/api/suppliers/${id}/statistics/`,
      method: METHODS.GET,
    }).then(Transform.supplierStatisticsData),
};

export const OrdersAPI = {
  getOrders: ({ params }: GetOrdersDataParams) =>
    client<Response.Orders>({
      url: '/api/orders/',
      params,
      method: METHODS.GET,
    }).then(Transform.Orders),
};

export const RolesAPI = {
  getRoles: ({ params }: GetRolesDataParams) =>
    client<Response.Roles>({
      url: '/api/roles/',
      params,
      method: METHODS.GET,
    }).then(Transform.RolesResponse),
};

export const QuizzesAPI = {
  getQuizzes: ({ params }: GetQuizzesDataParams) =>
    client<Response.Quizzes>({
      url: '/api/quizzes/',
      params,
      method: METHODS.GET,
    }).then(Transform.Quizzes),
};

export const DesignStylesAPI = {
  getDesignStyles: ({ params }: GetDesignStylesDataParams) =>
    client<Response.DesignStyles>({
      url: '/api/design_styles/',
      params,
      method: METHODS.GET,
    }).then(Transform.designStyles),
};

export const PropertyManagementTasksAPI = {
  getTasksList: ({ params }: GetNewTaskDataParams) =>
    client<Response.NewTasks>({
      url: '/api/property_tasks/',
      params,
      method: METHODS.GET,
    }).then(Transform.ManageTasks),
  getPublishedTasks: ({ params }: GetPublishedTaskDataParams) =>
    client<Response.PublishedTasks>({
      url: '/api/properties/published/',
      params,
      method: METHODS.GET,
    }).then(Transform.PublishedTasks),
  getArchivedTasks: ({ params }: GetArchivedTaskDataParams) =>
    client<Response.ArchivedTasks>({
      url: '/api/properties/archived/',
      params,
      method: METHODS.GET,
    }).then(Transform.ArchivedTasks),
};

export const PropertiesAPI = {
  getProperties: ({ params }: GetPropertiesDataParams) =>
    client<Response.Properties>({
      url: '/api/properties/',
      params,
      method: METHODS.GET,
    }).then(Transform.Properties),
};

export const ThreeDAPI = {
  getAllTasks: ({ params }: Get3DTasksDataParams) =>
    client<Response.ThreeDAllTasks>({
      url: '/api/products_tasks/',
      params,
      method: METHODS.GET,
    }).then(Transform.ThreeDAllTasks),
  getInDb: ({ params }: Get3DInDbDataParams) =>
    client<Response.ThreeDInDb>({
      url: '/api/products/',
      params: { ...params, status: ThreeDTasksStatus['In database'] },
      method: METHODS.GET,
    }).then(Transform.ThreeDInDb),
};

export const QuizResultsAPI = {
  getQuizResults: ({ params }: GetQuizResultsDataParams) =>
    client<Response.QuizResults>({
      url: '/api/quizzes_results/',
      params,
      method: METHODS.GET,
    }).then(Transform.ClientQuizzesResponse),
};

// @CLIENT

export const ClientAPI = {
  getRecentProperty: () =>
    client<Response.Property>({
      url: '/api/properties/recent_property/',
      method: METHODS.GET,
    }).then(Transform.transformProperty),
  processPropertyQuiz: (body: AuthPayload.OnboardingFields) =>
    client({
      url: '/api/properties/process_property_quiz/',
      data: Transform.onboardingFields(body),
    }),
  getLocation: () =>
    client({ url: '/api/users/get_location/', method: METHODS.GET }),
};

export const LogsAPI = {
  postUserLogs: (logData: UserLogType) => {
    if (getLocalStorage(AUTH_CONFIG_ROOT_KEY, null)) {
      client({
        url: '/api/user_logs/',
        data: { ...logData, metadata: JSON.stringify(logData.metadata) },
        method: METHODS.POST,
      });
    }
    if (
      myWindow.location.pathname.includes('onboarding') ||
      myWindow.location.pathname.includes('checkout')
    )
      myWindow.dataLayer?.push({
        ...logData,
        metadata: JSON.stringify(logData.metadata),
        event: 'click',
      });
  },
  pushDataLayer: (data: Object[]) => {
    data.forEach(e => myWindow.dataLayer?.push(data));
  },
  heapIdentify: (id: string) => {
    myWindow.heap?.identify(id);
  },
  heapAddUserProperties: (properties: {
    first_name?: string;
    last_name?: string;
    country?: string;
    email?: string;
  }) => {
    myWindow.heap?.addUserProperties(properties);
  },
};
