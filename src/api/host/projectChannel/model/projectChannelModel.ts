export interface ChannelAndCase {
  id?: string;
  channelEntities?: ChannelEntity[];
  channelCaseEntities?: ChannelCaseEntity[];
}

export interface ChannelEntity {
  id?: string;
  name?: string;
  username?: string;
  contact?: string;
  description?: string;
  state?: string;
}

export interface ChannelCaseEntity {
  id?: string;
  name?: string;
  contact?: string;
  avatar?: string;
  channelId?: string;
  state?: string;
}

export const ChannelCase = {
  _PERMS: {
    UPDATE: 'project:update',
    SEARCH: 'project:search',
  },
};
