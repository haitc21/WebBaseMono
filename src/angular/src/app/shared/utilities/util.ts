import { NbComponentStatus, NbGlobalPhysicalPosition, NbToastrConfig } from '@nebular/theme';
import { Consts } from '../consts';
import { ToastType } from '../enums';

export class Util {
  static configDefaultToast(
    type: NbComponentStatus,
    position: NbGlobalPhysicalPosition = NbGlobalPhysicalPosition.TOP_RIGHT,
    destroyByClick: boolean = Consts.TOAST_SESTROY_BY_CLICK,
    duration: number = Consts.TOAST_DURATION,
    hasIcon: boolean = Consts.TOAST_HAS_ICON,
    preventDuplicates: Boolean = Consts.PREVENT_DUPLICATES
  ) {
    const config = {
      status: type,
      destroyByClick: destroyByClick,
      duration: duration,
      hasIcon: hasIcon,
      position: position,
      preventDuplicates: preventDuplicates,
    };
    return config as  NbToastrConfig;
  }
}
