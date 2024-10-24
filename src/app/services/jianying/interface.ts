


export interface IJianYingProject {
  draftMetaInfo: IDraftMetaInfo;
  draftInfo: IDraftInfo;
}

export interface IDraftMetaInfo {
  cloud_package_completed_time: string;
  draft_cloud_capcut_purchase_info: string;
  draft_cloud_last_action_download: boolean;
  draft_cloud_materials: any[];
  draft_cloud_purchase_info: string;
  draft_cloud_template_id: string;
  draft_cloud_tutorial_info: string;
  draft_cloud_videocut_purchase_info: string;
  draft_cover: string;
  draft_deeplink_url: string;
  draft_enterprise_info: IDraftEnterpriseInfo;
  draft_fold_path: string;
  draft_id: string;
  draft_is_ai_shorts: boolean;
  draft_is_article_video_draft: boolean;
  draft_is_from_deeplink: string;
  draft_is_invisible: boolean;
  draft_materials: IDraftMaterial[];
  draft_materials_copied_info: any[];
  draft_name: string;
  draft_new_version: string;
  draft_removable_storage_device: string;
  draft_root_path: string;
  draft_segment_extra_info: any[];
  draft_timeline_materials_size_: number;
  tm_draft_cloud_completed: string;
  tm_draft_cloud_modified: number;
  tm_draft_create: number;
  tm_draft_modified: number;
  tm_draft_removed: number;
  tm_duration: number;
}

export interface IDraftMaterial {
  type: number;
  value: IValue[];
}

export interface IValue {
  create_time: number;
  duration: number;
  extra_info: string;
  file_Path: string;
  height: number;
  id: string;
  import_time: number;
  import_time_ms: number;
  item_source: number;
  md5: string;
  metetype: string;
  roughcut_time_range: IRoughCutTimeRange;
  sub_time_range: IRoughCutTimeRange;
  type: number;
  width: number;
}

export interface IRoughCutTimeRange {
  duration: number;
  start: number;
}

export interface IDraftEnterpriseInfo {
  draft_enterprise_extra: string;
  draft_enterprise_id: string;
  draft_enterprise_name: string;
  enterprise_material: any[];
}

export interface IDraftInfo {
  canvas_config: ICanvasConfig;
  color_space: number;
  config: IConfig;
  cover?: any;
  create_time: number;
  duration: number;
  extra_info?: any;
  fps: number;
  free_render_index_mode_on: boolean;
  group_container?: any;
  id: string;
  keyframe_graph_list: any[];
  keyframes: IKeyframes;
  last_modified_platform: ILastModifiedPlatform;
  materials: IMaterials;
  mutable_config?: any;
  name: string;
  new_version: string;
  platform: ILastModifiedPlatform;
  relationships: any[];
  render_index_track_mode_on: boolean;
  retouch_cover?: any;
  source: string;
  static_cover_image_path: string;
  tracks: ITrack[];
  update_time: number;
  version: number;
}

export interface ITrack {
  attribute: number;
  flag: number;
  id: string;
  is_default_name: boolean;
  name: string;
  segments: ISegment[];
  type: string;
}

export interface ISegment {
  cartoon: boolean;
  clip?: IClip | null;
  common_keyframes: ICommonKeyframe[];
  enable_adjust: boolean;
  enable_color_curves: boolean;
  enable_color_match_adjust: boolean;
  enable_color_wheels: boolean;
  enable_lut: boolean;
  enable_smart_color_adjust: boolean;
  extra_material_refs: string[];
  group_id: string;
  hdr_settings?: IHdrSetting | null;
  id: string;
  intensifies_audio: boolean;
  is_placeholder: boolean;
  is_tone_modify: boolean;
  keyframe_refs: any[];
  last_nonzero_volume: number;
  material_id: string;
  render_index: number;
  responsive_layout: IResponsiveLayout;
  reverse: boolean;
  source_timerange?: ITimeRange | null;
  speed: number;
  target_timerange: ITimeRange;
  template_id: string;
  template_scene: string;
  track_attribute: number;
  track_render_index: number;
  uniform_scale?: IUniformScale | null;
  visible: boolean;
  volume: number;
}

export interface IUniformScale {
  on: boolean;
  value: number;
}

export interface IResponsiveLayout {
  enable: boolean;
  horizontal_pos_layout: number;
  size_layout: number;
  target_follow: string;
  vertical_pos_layout: number;
}

export interface IHdrSetting {
  intensity: number;
  mode: number;
  nits: number;
}

export interface ICommonKeyframe {
  id: string;
  keyframe_list: IKeyframeList[];
  material_id: string;
  property_type: string;
}

export interface IKeyframeList {
  curveType: string;
  graphID: string;
  id: string;
  left_control: IShadowPoint;
  right_control: IShadowPoint;
  time_offset: number;
  values: number[];
}

export interface IClip {
  alpha: number;
  flip: IFlip;
  rotation: number;
  scale: IShadowPoint;
  transform: IShadowPoint;
}

export interface IFlip {
  horizontal: boolean;
  vertical: boolean;
}

export interface IMaterials {
  audio_balances: any[];
  audio_effects: any[];
  audio_fades: any[];
  audios: IAudio[];
  beats: IBeat[];
  canvases: ICanvas[];
  chromas: any[];
  color_curves: any[];
  digital_humans: any[];
  drafts: any[];
  effects: any[];
  flowers: any[];
  green_screens: any[];
  handwrites: any[];
  hsl: any[];
  images: any[];
  log_color_wheels: any[];
  loudnesses: any[];
  manual_deformations: any[];
  masks: any[];
  material_animations: any[];
  material_colors: any[];
  placeholders: any[];
  plugin_effects: any[];
  primary_color_wheels: any[];
  realtime_denoises: any[];
  shapes: any[];
  smart_crops: any[];
  smart_relights: any[];
  sound_channel_mappings: ISoundChannelMapping[];
  speeds: ISpeed[];
  stickers: any[];
  tail_leaders: any[];
  text_templates: any[];
  texts: IText[];
  transitions: any[];
  video_effects: any[];
  video_trackings: any[];
  videos: IVideo[];
  vocal_beautifys: any[];
  vocal_separations: IVocalSeparation[];
}

export interface IVocalSeparation {
  choice: number;
  id: string;
  production_path: string;
  time_range?: any;
  type: string;
}

export interface IVideo {
  aigc_type: string;
  audio_fade?: any;
  cartoon_path: string;
  category_id: string;
  category_name: string;
  check_flag: number;
  crop: ICrop;
  crop_ratio: string;
  crop_scale: number;
  duration: number;
  extra_type_option: number;
  formula_id: string;
  freeze?: any;
  gameplay?: any;
  has_audio: boolean;
  height: number;
  id: string;
  intensifies_audio_path: string;
  intensifies_path: string;
  is_ai_generate_content: boolean;
  is_unified_beauty_mode: boolean;
  local_id: string;
  local_material_id: string;
  material_id: string;
  material_name: string;
  material_url: string;
  matting: IMatting;
  media_path: string;
  object_locked?: any;
  origin_material_id: string;
  path: string;
  picture_from: string;
  picture_set_category_id: string;
  picture_set_category_name: string;
  request_id: string;
  reverse_intensifies_path: string;
  reverse_path: string;
  smart_motion?: any;
  source: number;
  source_platform: number;
  stable: Stable;
  team_id: string;
  type: string;
  video_algorithm: IVideoAlgorithm;
  width: number;
}

export interface IVideoAlgorithm {
  algorithms: any[];
  deflicker?: any;
  motion_blur_config?: any;
  noise_reduction?: any;
  path: string;
  quality_enhance?: any;
  time_range?: any;
}

export interface Stable {
  matrix_path: string;
  stable_level: number;
  time_range: ITimeRange;
}

export interface ITimeRange {
  duration: number;
  start: number;
}

export interface IMatting {
  flag: number;
  has_use_quick_brush: boolean;
  has_use_quick_eraser: boolean;
  interactiveTime: any[];
  path: string;
  strokes: any[];
}

export interface ICrop {
  lower_left_x: number;
  lower_left_y: number;
  lower_right_x: number;
  lower_right_y: number;
  upper_left_x: number;
  upper_left_y: number;
  upper_right_x: number;
  upper_right_y: number;
}

export interface IText {
  add_type: number;
  alignment: number;
  background_alpha: number;
  background_color: string;
  background_height: number;
  background_horizontal_offset: number;
  background_round_radius: number;
  background_style: number;
  background_vertical_offset: number;
  background_width: number;
  bold_width: number;
  border_alpha: number;
  border_color: string;
  border_width: number;
  caption_template_info: ICaptionTemplateInfo;
  check_flag: number;
  combo_info: IComboInfo;
  content: string;
  fixed_height: number;
  fixed_width: number;
  font_category_id: string;
  font_category_name: string;
  font_id: string;
  font_name: string;
  font_path: string;
  font_resource_id: string;
  font_size: number;
  font_source_platform: number;
  font_team_id: string;
  font_title: string;
  font_url: string;
  fonts: any[];
  force_apply_line_max_width: boolean;
  global_alpha: number;
  group_id: string;
  has_shadow: boolean;
  id: string;
  initial_scale: number;
  is_rich_text: boolean;
  italic_degree: number;
  ktv_color: string;
  language: string;
  layer_weight: number;
  letter_spacing: number;
  line_feed: number;
  line_max_width: number;
  line_spacing: number;
  name: string;
  original_size: any[];
  preset_category: string;
  preset_category_id: string;
  preset_has_set_alignment: boolean;
  preset_id: string;
  preset_index: number;
  preset_name: string;
  recognize_task_id: string;
  recognize_type: number;
  relevance_segment: any[];
  shadow_alpha: number;
  shadow_angle: number;
  shadow_color: string;
  shadow_distance: number;
  shadow_point: IShadowPoint;
  shadow_smoothing: number;
  shape_clip_x: boolean;
  shape_clip_y: boolean;
  style_name: string;
  sub_type: number;
  subtitle_keywords?: any;
  text_alpha: number;
  text_color: string;
  text_curve?: any;
  text_preset_resource_id: string;
  text_size: number;
  text_to_audio_ids: any[];
  tts_auto_update: boolean;
  type: string;
  typesetting: number;
  underline: boolean;
  underline_offset: number;
  underline_width: number;
  use_effect_default_color: boolean;
  words: IWords;
}

export interface IWords {
  end_time: any[];
  start_time: any[];
  text: any[];
}

export interface IShadowPoint {
  x: number;
  y: number;
}

export interface IComboInfo {
  text_templates: any[];
}

export interface ICaptionTemplateInfo {
  category_id: string;
  category_name: string;
  effect_id: string;
  resource_id: string;
  resource_name: string;
}

export interface ISpeed {
  curve_speed?: any;
  id: string;
  mode: number;
  speed: number;
  type: string;
}

export interface ISoundChannelMapping {
  audio_channel_mapping: number;
  id: string;
  is_config_open: boolean;
  type: string;
}

export interface ICanvas {
  album_image: string;
  blur: number;
  color: string;
  id: string;
  image: string;
  image_id: string;
  image_name: string;
  source_platform: number;
  team_id: string;
  type: string;
}

export interface IBeat {
  ai_beats: IAiBeats;
  enable_ai_beats: boolean;
  gear: number;
  gear_count: number;
  id: string;
  mode: number;
  type: string;
  user_beats: any[];
  user_delete_ai_beats?: any;
}

export interface IAiBeats {
  beat_speed_infos: any[];
  beats_path: string;
  beats_url: string;
  melody_path: string;
  melody_percents: number[];
  melody_url: string;
}

export interface IAudio {
  app_id: number;
  category_id: string;
  category_name: string;
  check_flag: number;
  duration: number;
  effect_id: string;
  formula_id: string;
  id: string;
  intensifies_path: string;
  is_ugc: boolean;
  local_material_id: string;
  music_id: string;
  name: string;
  path: string;
  query: string;
  request_id: string;
  resource_id: string;
  search_id: string;
  source_platform: number;
  team_id: string;
  text_id: string;
  tone_category_id: string;
  tone_category_name: string;
  tone_effect_id: string;
  tone_effect_name: string;
  tone_speaker: string;
  tone_type: string;
  type: string;
  video_id: string;
  wave_points: any[];
}

export interface ILastModifiedPlatform {
  app_id: number;
  app_source: string;
  app_version: string;
  device_id: string;
  hard_disk_id: string;
  mac_address: string;
  os: string;
  os_version: string;
}

export interface IKeyframes {
  adjusts: any[];
  audios: any[];
  effects: any[];
  filters: any[];
  handwrites: any[];
  stickers: any[];
  texts: any[];
  videos: any[];
}

export interface IConfig {
  adjust_max_index: number;
  attachment_info: any[];
  combination_max_index: number;
  export_range?: any;
  extract_audio_last_index: number;
  lyrics_recognition_id: string;
  lyrics_sync: boolean;
  lyrics_taskinfo: any[];
  maintrack_adsorb: boolean;
  material_save_mode: number;
  original_sound_last_index: number;
  record_audio_last_index: number;
  sticker_max_index: number;
  subtitle_recognition_id: string;
  subtitle_sync: boolean;
  subtitle_taskinfo: any[];
  system_font_list: any[];
  video_mute: boolean;
  zoom_info_params?: any;
}

export interface ICanvasConfig {
  height: number;
  ratio: string;
  width: number;
}


export interface ISrt {
  type: string;
  data: {
    start: number;
    end: number;
    text: string;
  }
}
