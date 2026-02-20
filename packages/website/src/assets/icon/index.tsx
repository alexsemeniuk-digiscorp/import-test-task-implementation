import { CSSProperties, FC, SVGProps } from 'react';
import { ReactComponent as shopGrey } from './icons/Shop-grey.svg';
import { ReactComponent as AlignIcon } from './icons/align.svg';
import { ReactComponent as ArrowLeftIcon } from './icons/arrow-left.svg';
import { ReactComponent as ArrowRightBlueIcon } from './icons/arrow-right-blue.svg';
import { ReactComponent as ArrowRightIcon } from './icons/arrow-right.svg';
import { ReactComponent as ArrowUpIcon } from './icons/arrow-up.svg';
import { ReactComponent as Attach } from './icons/attach.svg';
import { ReactComponent as BellIcon } from './icons/bell.svg';
import { ReactComponent as BlockIcon } from './icons/block.svg';
import { ReactComponent as BookMarkIcon } from './icons/bookmark.svg';
import { ReactComponent as CalendarIcon } from './icons/calendar.svg';
import { ReactComponent as CallIcon } from './icons/call.svg';
import { ReactComponent as Camera } from './icons/camera.svg';
import { ReactComponent as CardIcon } from './icons/card.svg';
import { ReactComponent as CashIcon } from './icons/cash.svg';
import { ReactComponent as ChatIcon } from './icons/chat.svg';
import { ReactComponent as ChattingIcon } from './icons/chatting.svg';
import { ReactComponent as CircleOutlineSuccess } from './icons/check-circle-outline-success.svg';
import { ReactComponent as CircleOutline } from './icons/check-circle-outline.svg';
import { ReactComponent as checkGrey } from './icons/check-grey.svg';
import { ReactComponent as CheckIcon } from './icons/check.svg';
import { ReactComponent as ChevronDownIcon } from './icons/chevron-down.svg';
import { ReactComponent as ChevronLeftIcon } from './icons/chevron-left.svg';
import { ReactComponent as ChevronRightIcon } from './icons/chevron-right.svg';
import { ReactComponent as ChevronUpIcon } from './icons/chevron-up.svg';
import { ReactComponent as CircleHelp } from './icons/circle-help.svg';
import { ReactComponent as CircleRemove } from './icons/circle-remove.svg';
import { ReactComponent as ClassIcon } from './icons/class.svg';
import { ReactComponent as ClockDelayIcon } from './icons/clock-delay.svg';
import { ReactComponent as Time } from './icons/clock-timer.svg';
import { ReactComponent as clockIcon } from './icons/clock.svg';
import { ReactComponent as CloseIcon } from './icons/close.svg';
import { ReactComponent as CompositeProductIcon } from './icons/composite-product.svg';
import { ReactComponent as CopyIcon } from './icons/copy.svg';
import { ReactComponent as CursorIcon } from './icons/cursor.svg';
import { ReactComponent as DeleteIcon } from './icons/delete.svg';
import { ReactComponent as DiamondIcon } from './icons/diamond-outline.svg';
import { ReactComponent as DiscountIcon } from './icons/discount.svg';
import { ReactComponent as documentEmpty } from './icons/document-empty.svg';
import { ReactComponent as DollarIcon } from './icons/dollar.svg';
import { ReactComponent as Download } from './icons/download.svg';
import { ReactComponent as EditAlt } from './icons/edit-alt.svg';
import { ReactComponent as EditIcon } from './icons/edit.svg';
import { ReactComponent as ExcelIcon } from './icons/excel.svg';
import { ReactComponent as EyeIcon } from './icons/eye.svg';
import { ReactComponent as Facebook } from './icons/facebook.svg';
import { ReactComponent as FileBgIcon } from './icons/file-bg.svg';
import { ReactComponent as FileIcon } from './icons/file.svg';
import { ReactComponent as FiltersIcon } from './icons/filters.svg';
import { ReactComponent as folderGrey } from './icons/folder-grey.svg';
import { ReactComponent as FolderIcon } from './icons/folder.svg';
import { ReactComponent as GearIcon } from './icons/gear.svg';
import { ReactComponent as GoogleIcon } from './icons/google.svg';
import { ReactComponent as HandShakeIcon } from './icons/hand-shake.svg';
import { ReactComponent as HandIcon } from './icons/hand.svg';
import { ReactComponent as HeartFilledIcon } from './icons/heart-filled.svg';
import { ReactComponent as HeartIcon } from './icons/heart.svg';
import { ReactComponent as ImageIcon } from './icons/image.svg';
import { ReactComponent as InfoIcon } from './icons/info.svg';
import { ReactComponent as Instagram } from './icons/instagram.svg';
import { ReactComponent as Linked } from './icons/linked.svg';
import { ReactComponent as LockIcon } from './icons/lock.svg';
import { ReactComponent as Magento } from './icons/magento.svg';
import { ReactComponent as mailGrey } from './icons/mail-grey.svg';
import { ReactComponent as MailIcon } from './icons/mail.svg';
import { ReactComponent as MaintenanceIcon } from './icons/maintenance.svg';
import { ReactComponent as MapIcon } from './icons/map-pin.svg';
import { ReactComponent as MeetingIcon } from './icons/meeting.svg';
import { ReactComponent as MembershipIcon } from './icons/membership.svg';
import { ReactComponent as MenuOptions } from './icons/menu-options.svg';
import { ReactComponent as AccountingIcon } from './icons/menu/accounting.svg';
import { ReactComponent as CartIcon } from './icons/menu/cart.svg';
import { ReactComponent as ContractsIcon } from './icons/menu/contracts.svg';
import { ReactComponent as CRMIcon } from './icons/menu/crm.svg';
import { ReactComponent as DashboardIcon } from './icons/menu/dashboard.svg';
import { ReactComponent as IntegrationIcon } from './icons/menu/integration.svg';
import { ReactComponent as InventoryIcon } from './icons/menu/inventory.svg';
import { ReactComponent as KeyIcon } from './icons/menu/key.svg';
import { ReactComponent as MenuBurgerIcon } from './icons/menu/menu-burger.svg';
import { ReactComponent as MenuHrIcon } from './icons/menu/menu-hr.svg';
import { ReactComponent as QuotesIcon } from './icons/menu/quotes.svg';
import { ReactComponent as SchedulingIcon } from './icons/menu/scheduling.svg';
import { ReactComponent as SpeakerIcon } from './icons/menu/speaker.svg';
import { ReactComponent as TaskIcon } from './icons/menu/task.svg';
import { ReactComponent as TicketIcon } from './icons/menu/ticket.svg';
import { ReactComponent as TrackingIcon } from './icons/menu/tracking.svg';
import { ReactComponent as WebsiteIcon } from './icons/menu/website.svg';
import { ReactComponent as messageGrey } from './icons/message-grey.svg';
import { ReactComponent as MessageIcon } from './icons/message.svg';
import { ReactComponent as MessengerIcon } from './icons/messenger.svg';
import { ReactComponent as MoneyBag } from './icons/money-bag-dollar.svg';
import { ReactComponent as numpad } from './icons/numpad.svg';
import { ReactComponent as OptionHorizontal } from './icons/options-horizontal.svg';
import { ReactComponent as OptionsVertical } from './icons/options-vertical.svg';
import { ReactComponent as PauseIcon } from './icons/pause.svg';
import { ReactComponent as PaymentError } from './icons/payment-error.svg';
import { ReactComponent as PaymentPending } from './icons/payment-pending.svg';
import { ReactComponent as PaymentSuccess } from './icons/payment-success.svg';
import { ReactComponent as PDFIcon } from './icons/pdf.svg';
import { ReactComponent as PhoneTransferIcon } from './icons/phone-transfer.svg';
import { ReactComponent as PhoneIcon } from './icons/phone.svg';
import { ReactComponent as PlayFilledIcon } from './icons/play-filled.svg';
import { ReactComponent as PlayIcon } from './icons/play.svg';
import { ReactComponent as PlusCircleIcon } from './icons/plus-circle.svg';
import { ReactComponent as PlusIcon } from './icons/plus.svg';
import { ReactComponent as PosTerminal } from './icons/pos-terminal.svg';
import { ReactComponent as Print } from './icons/print.svg';
import { ReactComponent as ProductGroupIcon } from './icons/product-group.svg';
import { ReactComponent as ProductIcon } from './icons/product.svg';
import { ReactComponent as QuickBooks } from './icons/quickbooks.svg';
import { ReactComponent as RecordIcon } from './icons/record.svg';
import { ReactComponent as RedoIcon } from './icons/redo.svg';
import { ReactComponent as Refresh } from './icons/refresh.svg';
import { ReactComponent as Reorder } from './icons/reorder.svg';
import { ReactComponent as ResourceIcon } from './icons/resource.svg';
import { ReactComponent as Sage } from './icons/sage.svg';
import { ReactComponent as ServiceIcon } from './icons/service.svg';
import { ReactComponent as ShareIcon } from './icons/share.svg';
import { ReactComponent as ShopIcon } from './icons/shop.svg';
import { ReactComponent as Shopify } from './icons/shopify.svg';
import { ReactComponent as SignOutIcon } from './icons/sign-out.svg';
import { ReactComponent as SortIcon } from './icons/sort.svg';
import { ReactComponent as SplitIcon } from './icons/split.svg';
import { ReactComponent as StarIcon } from './icons/star.svg';
import { ReactComponent as StorageIcon } from './icons/storage.svg';
import { ReactComponent as Terminal } from './icons/terminal.svg';
import { ReactComponent as TranscriptionIcon } from './icons/transcription.svg';
import { ReactComponent as UndoIcon } from './icons/undo.svg';
import { ReactComponent as UnlockIcon } from './icons/unlock.svg';
import { ReactComponent as UploadIcon } from './icons/upload.svg';
import { ReactComponent as UploadLogo } from './icons/uploadLogo.svg';
import { ReactComponent as UserGroupIcon } from './icons/user-group.svg';
import { ReactComponent as UserIcon } from './icons/user.svg';
import { ReactComponent as VoiceMailIcon } from './icons/voice-mail.svg';
import { ReactComponent as WaitingIcon } from './icons/waiting-icon.svg';
import { ReactComponent as WarningIcon } from './icons/warning.svg';
import { ReactComponent as WebChat } from './icons/webchat/webchat.svg';
import { ReactComponent as websiteGrey } from './icons/website-grey.svg';
import { ReactComponent as WhatsappIcon } from './icons/whatsapp.svg';
import { ReactComponent as Woocommerce } from './icons/woocommerce.svg';
import { ReactComponent as Xero } from './icons/xero.svg';
import { ReactComponent as ZoomIn } from './icons/zoom-in.svg';
import { ReactComponent as ZoomOut } from './icons/zoom-out.svg';

export type IconType =
  | 'messenger'
  | 'numpad'
  | 'star'
  | 'phone-transfer'
  | 'align'
  | 'share'
  | 'play-filled'
  | 'record'
  | 'google'
  | 'plus-circle'
  | 'arrow-left'
  | 'arrow-right'
  | 'arrow-right-primary'
  | 'dashboard'
  | 'crm'
  | 'task'
  | 'quotes'
  | 'cart'
  | 'inventory'
  | 'accounting'
  | 'contracts'
  | 'integration'
  | 'bell'
  | 'message'
  | 'shop'
  | 'gear'
  | 'map'
  | 'close'
  | 'sign-out'
  | 'chevron-left'
  | 'circle-outline'
  | 'circle-outline-success'
  | 'chat'
  | 'mail'
  | 'plus'
  | 'menu-hr'
  | 'menu-burger'
  | 'scheduling'
  | 'ticket'
  | 'key'
  | 'speaker'
  | 'website'
  | 'tracking'
  | 'chevron-up'
  | 'chevron-down'
  | 'call'
  | 'edit'
  | 'file-bg'
  | 'delete'
  | 'options-vertical'
  | 'eye'
  | 'filters'
  | 'calendar'
  | 'circle-remove'
  | 'meeting'
  | 'voice-mail'
  | 'product'
  | 'product-group'
  | 'composite-product'
  | 'service'
  | 'class'
  | 'resource'
  | 'membership'
  | 'discount'
  | 'upload'
  | 'arrow-up'
  | 'copy'
  | 'check'
  | 'heart'
  | 'heart-filled'
  | 'circle-help'
  | 'download'
  | 'block'
  | 'lock'
  | 'unlock'
  | 'image'
  | 'instagram'
  | 'facebook'
  | 'linked'
  | 'menu-options'
  | 'user'
  | 'sort'
  | 'maintenance'
  | 'warning'
  | 'bookmark'
  | 'cash'
  | 'card'
  | 'split'
  | 'file'
  | 'folder'
  | 'chevron-right'
  | 'pdf'
  | 'chatting'
  | 'options-horizontal'
  | 'print'
  | 'clock-delay'
  | 'excel'
  | 'undo'
  | 'reorder'
  | 'redo'
  | 'play'
  | 'pause'
  | 'whatsApp'
  | 'attach'
  | 'phone'
  | 'info'
  | 'waiting-icon'
  | 'userGroup'
  | 'dollarIcon'
  | 'handShake'
  | 'storage'
  | 'clockIcon'
  | 'shopGrey'
  | 'mailGrey'
  | 'messageGrey'
  | 'documentEmpty'
  | 'checkGrey'
  | 'folderGrey'
  | 'websiteGrey'
  | 'upload-logo'
  | 'hand'
  | 'cursor'
  | 'zoomIn'
  | 'zoomOut'
  | 'refresh'
  | 'shopify'
  | 'woocommerce'
  | 'magento'
  | 'payment-success'
  | 'payment-pending'
  | 'payment-error'
  | 'terminal'
  | 'edit-alt'
  | 'pos-terminal'
  | 'web-chat'
  | 'transcription'
  | 'diamondIcon'
  | 'quickbooks'
  | 'xero'
  | 'sage'
  | 'camera'
  | 'money-bag'
  | 'time';

export const iconsMap: Record<IconType, FC<SVGProps<SVGSVGElement>>> = {
  ['messenger']: MessengerIcon,
  ['numpad']: numpad,
  ['phone-transfer']: PhoneTransferIcon,
  ['star']: StarIcon,
  ['align']: AlignIcon,
  ['share']: ShareIcon,
  ['options-horizontal']: OptionHorizontal,
  ['play-filled']: PlayFilledIcon,
  ['record']: RecordIcon,
  ['attach']: Attach,
  ['print']: Print,
  ['google']: GoogleIcon,
  ['plus-circle']: PlusCircleIcon,
  ['arrow-left']: ArrowLeftIcon,
  ['arrow-right']: ArrowRightIcon,
  ['arrow-right-primary']: ArrowRightBlueIcon,
  ['dashboard']: DashboardIcon,
  ['crm']: CRMIcon,
  ['task']: TaskIcon,
  ['quotes']: QuotesIcon,
  ['cart']: CartIcon,
  ['inventory']: InventoryIcon,
  ['accounting']: AccountingIcon,
  ['contracts']: ContractsIcon,
  ['integration']: IntegrationIcon,
  ['bell']: BellIcon,
  ['message']: MessageIcon,
  ['shop']: ShopIcon,
  ['gear']: GearIcon,
  ['map']: MapIcon,
  ['close']: CloseIcon,
  ['sign-out']: SignOutIcon,
  ['chevron-left']: ChevronLeftIcon,
  ['chat']: ChatIcon,
  ['mail']: MailIcon,
  ['plus']: PlusIcon,
  ['menu-hr']: MenuHrIcon,
  ['menu-burger']: MenuBurgerIcon,
  ['scheduling']: SchedulingIcon,
  ['ticket']: TicketIcon,
  ['key']: KeyIcon,
  ['speaker']: SpeakerIcon,
  ['website']: WebsiteIcon,
  ['tracking']: TrackingIcon,
  ['chevron-down']: ChevronDownIcon,
  ['chevron-up']: ChevronUpIcon,
  ['call']: CallIcon,
  ['edit']: EditIcon,
  ['file-bg']: FileBgIcon,
  ['delete']: DeleteIcon,
  ['options-vertical']: OptionsVertical,
  ['eye']: EyeIcon,
  ['filters']: FiltersIcon,
  ['calendar']: CalendarIcon,
  ['circle-remove']: CircleRemove,
  ['circle-outline']: CircleOutline,
  ['circle-outline-success']: CircleOutlineSuccess,
  ['split']: SplitIcon,
  ['meeting']: MeetingIcon,
  ['voice-mail']: VoiceMailIcon,
  ['product']: ProductIcon,
  ['product-group']: ProductGroupIcon,
  ['composite-product']: CompositeProductIcon,
  ['service']: ServiceIcon,
  ['class']: ClassIcon,
  ['resource']: ResourceIcon,
  ['membership']: MembershipIcon,
  ['discount']: DiscountIcon,
  ['upload']: UploadIcon,
  ['arrow-up']: ArrowUpIcon,
  ['circle-help']: CircleHelp,
  ['download']: Download,
  ['copy']: CopyIcon,
  ['check']: CheckIcon,
  ['heart']: HeartIcon,
  ['heart-filled']: HeartFilledIcon,
  ['image']: ImageIcon,
  ['instagram']: Instagram,
  ['facebook']: Facebook,
  ['linked']: Linked,
  ['block']: BlockIcon,
  ['lock']: LockIcon,
  ['unlock']: UnlockIcon,
  ['menu-options']: MenuOptions,
  ['user']: UserIcon,
  ['sort']: SortIcon,
  ['maintenance']: MaintenanceIcon,
  ['warning']: WarningIcon,
  ['bookmark']: BookMarkIcon,
  ['card']: CardIcon,
  ['cash']: CashIcon,
  ['file']: FileIcon,
  ['chatting']: ChattingIcon,
  ['folder']: FolderIcon,
  ['chevron-right']: ChevronRightIcon,
  ['pdf']: PDFIcon,
  ['clock-delay']: ClockDelayIcon,
  ['excel']: ExcelIcon,
  ['undo']: UndoIcon,
  ['redo']: RedoIcon,
  ['play']: PlayIcon,
  ['pause']: PauseIcon,
  ['reorder']: Reorder,
  ['whatsApp']: WhatsappIcon,
  ['phone']: PhoneIcon,
  ['upload-logo']: UploadLogo,
  ['info']: InfoIcon,
  ['waiting-icon']: WaitingIcon,
  ['userGroup']: UserGroupIcon,
  ['dollarIcon']: DollarIcon,
  ['handShake']: HandShakeIcon,
  ['storage']: StorageIcon,
  ['clockIcon']: clockIcon,
  ['shopGrey']: shopGrey,
  ['mailGrey']: mailGrey,
  ['messageGrey']: messageGrey,
  ['documentEmpty']: documentEmpty,
  ['checkGrey']: checkGrey,
  ['folderGrey']: folderGrey,
  ['websiteGrey']: websiteGrey,
  ['hand']: HandIcon,
  ['cursor']: CursorIcon,
  ['zoomIn']: ZoomIn,
  ['zoomOut']: ZoomOut,
  ['refresh']: Refresh,
  ['shopify']: Shopify,
  ['woocommerce']: Woocommerce,
  ['magento']: Magento,
  ['payment-success']: PaymentSuccess,
  ['payment-pending']: PaymentPending,
  ['payment-error']: PaymentError,
  ['terminal']: Terminal,
  ['edit-alt']: EditAlt,
  ['pos-terminal']: PosTerminal,
  ['web-chat']: WebChat,
  ['transcription']: TranscriptionIcon,
  ['diamondIcon']: DiamondIcon,
  ['quickbooks']: QuickBooks,
  ['xero']: Xero,
  ['sage']: Sage,
  ['camera']: Camera,
  ['time']: Time,
  ['money-bag']: MoneyBag,
};

export enum IconSize {
  XXS = 12,
  Tiny = 14,
  Small = 16,
  Medium = 20,
  Large = 24,
  XL = 40,
  XXL = 100,
}

type SvgIconProps = SVGProps<SVGSVGElement> & {
  type?: IconType;
  size?: IconSize;
  exactSize?: number;
  styles?: CSSProperties;
};

export const Icon: FC<SvgIconProps> = ({
  type,
  size = IconSize.Medium,
  exactSize,
  color,
  styles,
}) => {
  if (!type) {
    return null;
  }

  const Icon = iconsMap[type];

  const resultSize = exactSize || size;

  return (
    <Icon color={color} width={resultSize} height={resultSize} style={styles} />
  );
};
