export interface DealHouseModel {
  projectId?: string;
  houseId?: string;
  cName?: string;
  cMobile?: string;
  price?: string;
  dealTime?: string;
}

export const DealHouseConst = {
  _RULES: {
    cMobile: [
      {
        required: true,
        trigger: 'change',
        validator: function async(_rule, contact: string) {
          if (!/^1[3-9]{1}[0-9]{9}$/.test(contact)) {
            return Promise.reject('输入正确手机号');
          }
          return Promise.resolve();
        },
      },
    ],
  },
};
