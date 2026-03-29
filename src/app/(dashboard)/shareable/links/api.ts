import api from "@/api";
import { API_ENDPOINTS } from "@/api/endpoints";
import { ISharedLink } from "@/interfaces/SharedLink";

interface PaginatedResponse<T> {
  data: ISharedLink[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export const getSharedLinks = (storeId: number, page = 1) =>
api.get<PaginatedResponse<ISharedLink>>("/shared-links", {
params: { store_id: storeId, page },
});

export const createSharedLink = (data: {
  name?: string;
  product_ids: number[];
  expires_at?: string;
}) => api.post(API_ENDPOINTS.SHARED_LINKS, data);

export const deleteSharedLink = (id: number) =>
  api.delete(`${API_ENDPOINTS.SHARED_LINKS}/${id}`);
