import { getTime } from '../../utils/common';
import { v4 } from 'uuid';
import { IDraftMaterial, IMaterials, ISegment, ITrack } from './interface';
import path from 'path';


export class JianYingSchema {

  public genId() {
    return v4();
  }

  /**
   * 创建元数据
   * @param options
   */
  public createDraftMetaInfoBase(options: {
    draftRootPath: string;
    projectName: string;
    draftMaterials?: IDraftMaterial[]
  }) {
    const { draftRootPath, projectName, draftMaterials = [] } = options;
    const draftFoldPath = path.join(draftRootPath, projectName);
    return {
      "cloud_package_completed_time": "",
      "draft_cloud_capcut_purchase_info": "",
      "draft_cloud_last_action_download": false,
      "draft_cloud_materials": [],
      "draft_cloud_purchase_info": "",
      "draft_cloud_template_id": "",
      "draft_cloud_tutorial_info": "",
      "draft_cloud_videocut_purchase_info": "",
      "draft_cover": "draft_cover.jpg",
      "draft_deeplink_url": "",
      "draft_enterprise_info": {
        "draft_enterprise_extra": "",
        "draft_enterprise_id": "",
        "draft_enterprise_name": "",
        "enterprise_material": []
      },
      "draft_fold_path": draftFoldPath,
      "draft_id": "CD32B7C9-ACC9-4FDD-90E7-F044A9570CAA",
      "draft_is_ai_shorts": false,
      "draft_is_article_video_draft": false,
      "draft_is_from_deeplink": "false",
      "draft_is_invisible": false,
      "draft_materials": draftMaterials,
      "draft_materials_copied_info": [],
      "draft_name": "1月10日",
      "draft_new_version": "",
      "draft_removable_storage_device": "",
      "draft_root_path": draftRootPath,
      "draft_segment_extra_info": [],
      "draft_timeline_materials_size_": 3402023,
      "tm_draft_cloud_completed": "",
      "tm_draft_cloud_modified": 0,
      "tm_draft_create": 1704879568602684,
      "tm_draft_modified": 1704880109252399,
      "tm_draft_removed": 0,
      "tm_duration": 933333
    };
  }


  /**
   * 创建资源项
   * @param options
   */
  public createDraftMaterialsItem(options: {
    duration: number;
    // 资源名称
    extra_info: string;
    // 资源绝对路径
    file_Path: string;
    //
    metetype: string;
    roughcut_time_range: {
      duration: number;
      start: number;
    },
    sub_time_range: {
      duration: number;
      start: number;
    },
    height: number;
    width: number;
  }) {
    const {
      duration,
      extra_info,
      file_Path,
      roughcut_time_range,
      sub_time_range,
      height,
      width,
      metetype
    } = options;
    const now = getTime();
    const id = this.genId();
    return {
      "type": 0,
      "create_time": now,
      "duration": duration,
      "extra_info": extra_info,
      "file_Path": file_Path,
      "height": height,
      "width": width,
      "id": id,
      "import_time": now,
      "import_time_ms": now,
      "item_source": 1,
      "md5": "",
      "metetype": metetype,
      "roughcut_time_range": roughcut_time_range,
      "sub_time_range": sub_time_range,
    };
  }


  /**
   * 创建剪映操作信息
   */
  public createDraftInfoBase(options: {
    materials: IMaterials;
    tracks: ITrack[];
    duration: number;
  }) {
    const { materials, tracks = [], duration } = options;
    const id = this.genId();
    return {
      "canvas_config": {
        "height": 1440,
        "ratio": "4:3",
        "width": 1920
      },
      "color_space": 0,
      "config": {
        "adjust_max_index": 1,
        "attachment_info": [],
        "combination_max_index": 1,
        "export_range": null,
        "extract_audio_last_index": 1,
        "lyrics_recognition_id": "",
        "lyrics_sync": true,
        "lyrics_taskinfo": [],
        "maintrack_adsorb": true,
        "material_save_mode": 0,
        "original_sound_last_index": 1,
        "record_audio_last_index": 1,
        "sticker_max_index": 1,
        "subtitle_recognition_id": "",
        "subtitle_sync": true,
        "subtitle_taskinfo": [],
        "system_font_list": [],
        "video_mute": false,
        "zoom_info_params": null
      },
      "cover": null,
      "create_time": 0,
      "duration": duration,
      "extra_info": null,
      "fps": 30.0,
      "free_render_index_mode_on": false,
      "group_container": null,
      "id": id,
      "keyframe_graph_list": [],
      "keyframes": {
        "adjusts": [],
        "audios": [],
        "effects": [],
        "filters": [],
        "handwrites": [],
        "stickers": [],
        "texts": [],
        "videos": []
      },
      "last_modified_platform": {
        "app_id": 3704,
        "app_source": "lv",
        "app_version": "5.0.0",
        "device_id": "d3203c3724a055cda098e7e83e1dbf61",
        "hard_disk_id": "b52cdb7e29b58c2788e28501cafeeef7",
        "mac_address": "48d7849aa24e8f2e3b16bfcfeadc877d",
        "os": "mac",
        "os_version": "13.0.1"
      },
      "materials": materials,
      "mutable_config": null,
      "name": "",
      "new_version": "93.0.0",
      "platform": {
        "app_id": 3704,
        "app_source": "lv",
        "app_version": "5.0.0",
        "device_id": "d3203c3724a055cda098e7e83e1dbf61",
        "hard_disk_id": "b52cdb7e29b58c2788e28501cafeeef7",
        "mac_address": "48d7849aa24e8f2e3b16bfcfeadc877d",
        "os": "mac",
        "os_version": "13.0.1"
      },
      "relationships": [],
      "render_index_track_mode_on": true,
      "retouch_cover": null,
      "source": "default",
      "static_cover_image_path": "",
      "tracks": tracks,
      "update_time": 0,
      "version": 360000
    };
  }


  public createAudio(options: {
    duration: number;
    // "del120katiwnxh.wav.wav",
    name: string;
    // "/Users/fzm/Downloads/del120katiwnxh.wav.wav"
    path: string;
  }) {
    const { duration, name, path } = options;
    const id = this.genId();
    return {
      "app_id": 0,
      "category_id": "",
      "category_name": "",
      "check_flag": 1,
      "duration": duration,
      "effect_id": "",
      "formula_id": "",
      "id": id,
      "intensifies_path": "",
      "is_ugc": false,
      "local_material_id": "",
      "music_id": "",
      "name": name,
      "path": path,
      "query": "",
      "request_id": "",
      "resource_id": "",
      "search_id": "",
      "source_platform": 0,
      "team_id": "",
      "text_id": "",
      "tone_category_id": "",
      "tone_category_name": "",
      "tone_effect_id": "",
      "tone_effect_name": "",
      "tone_speaker": "",
      "tone_type": "",
      "type": "extract_music",
      "video_id": "",
      "wave_points": []
    };
  }


  public createBeat() {
    const id = this.genId();
    return {
      "ai_beats": {
        "beat_speed_infos": [],
        "beats_path": "",
        "beats_url": "",
        "melody_path": "",
        "melody_percents": [
          0.0
        ],
        "melody_url": ""
      },
      "enable_ai_beats": false,
      "gear": 404,
      "gear_count": 0,
      "id": id,
      "mode": 404,
      "type": "beats",
      "user_beats": [],
      "user_delete_ai_beats": null
    };
  }


  public createCanvas() {
    const id = this.genId();
    return {
      "album_image": "",
      "blur": 0.0,
      "color": "",
      "id": id,
      "image": "",
      "image_id": "",
      "image_name": "",
      "source_platform": 0,
      "team_id": "",
      "type": "canvas_color"
    };
  }


  public createMaterialAnimation() {
    const id = this.genId();
    return {
      "animations": [],
      "id": id,
      "type": "sticker_animation"
    };
  }


  public createText(options: {
    text: string;
    fontPath?: string;
  }) {
    const {
      text,
      fontPath = "/Applications/VideoFusion-macOS.app/Contents/Resources/Font/SystemFont/zh-hans.ttf"
    } = options;
    const id = this.genId();
    const content = {
      "styles": [
        {
          "fill": {
            "content": {
              "solid": {
                "color": [
                  1,
                  1,
                  1
                ]
              }
            }
          },
          "range": [
            0,
            36
          ],
          "size": 7,
          "font": {
            'path': fontPath,
            'id': ''
          }
        }
      ],
      "text": text
    };
    const contentStr = JSON.stringify(content);
    return {
      "id": id,
      "add_type": 0,
      "alignment": 1,
      "background_alpha": 1.0,
      "background_color": "",
      "background_height": 0.14,
      "background_horizontal_offset": 0.0,
      "background_round_radius": 0.0,
      "background_style": 0,
      "background_vertical_offset": 0.0,
      "background_width": 0.14,
      "bold_width": 0.0,
      "border_alpha": 1.0,
      "border_color": "",
      "border_width": 0.08,
      "caption_template_info": {
        "category_id": "",
        "category_name": "",
        "effect_id": "",
        "resource_id": "",
        "resource_name": ""
      },
      "check_flag": 7,
      "combo_info": {
        "text_templates": []
      },
      "content": contentStr,
      "fixed_height": -1.0,
      "fixed_width": 800,
      "font_category_id": "",
      "font_category_name": "",
      "font_id": "",
      "font_name": "",
      "font_path": fontPath,
      "font_resource_id": "",
      "font_size": 7.0,
      "font_source_platform": 0,
      "font_team_id": "",
      "font_title": "none",
      "font_url": "",
      "fonts": [],
      "force_apply_line_max_width": false,
      "global_alpha": 1.0,
      "group_id": "",
      "has_shadow": false,
      "initial_scale": 1.0,
      "is_rich_text": false,
      "italic_degree": 0,
      "ktv_color": "",
      "language": "",
      "layer_weight": 1,
      "letter_spacing": 0.0,
      "line_feed": 1,
      "line_max_width": 0.82,
      "line_spacing": 0.02,
      "name": "",
      "original_size": [],
      "preset_category": "",
      "preset_category_id": "",
      "preset_has_set_alignment": false,
      "preset_id": "",
      "preset_index": 0,
      "preset_name": "",
      "recognize_task_id": "",
      "recognize_type": 0,
      "relevance_segment": [],
      "shadow_alpha": 0.8,
      "shadow_angle": -45.0,
      "shadow_color": "#000000",
      "shadow_distance": 8.0,
      "shadow_point": {
        "x": 1.0182337649086284,
        "y": -1.0182337649086284
      },
      "shadow_smoothing": 0.99,
      "shape_clip_x": false,
      "shape_clip_y": false,
      "style_name": "",
      "sub_type": 0,
      "subtitle_keywords": null,
      "text_alpha": 1.0,
      "text_color": "#ffffff",
      "text_curve": null,
      "text_preset_resource_id": "",
      "text_size": 6,
      "text_to_audio_ids": [],
      "tts_auto_update": false,
      "type": "text",
      "typesetting": 0,
      "underline": false,
      "underline_offset": 0.22,
      "underline_width": 0.05,
      "use_effect_default_color": false,
      "words": {
        "end_time": [],
        "start_time": [],
        "text": []
      }
    }
  }


  public createVideo(options: {
    // "/Users/fzm/Downloads/2.png"
    path: string;
    // 10800000000
    duration?: number;
    // 1.png
    materialName: string
  }) {
    const { path, duration = 10800000000, materialName } = options;
    const id = this.genId();
    return {
      "aigc_type": "none",
      "audio_fade": null,
      "cartoon_path": "",
      "category_id": "",
      "category_name": "",
      "check_flag": 63487,
      "crop": {
        "lower_left_x": 0.0,
        "lower_left_y": 1.0,
        "lower_right_x": 1.0,
        "lower_right_y": 1.0,
        "upper_left_x": 0.0,
        "upper_left_y": 0.0,
        "upper_right_x": 1.0,
        "upper_right_y": 0.0
      },
      "crop_ratio": "free",
      "crop_scale": 1.0,
      "duration": duration,
      "extra_type_option": 0,
      "formula_id": "",
      "freeze": null,
      "gameplay": null,
      "has_audio": false,
      "height": 2048,
      "id": id,
      "intensifies_audio_path": "",
      "intensifies_path": "",
      "is_ai_generate_content": false,
      "is_unified_beauty_mode": false,
      "local_id": "",
      "local_material_id": "",
      "material_id": "",
      "material_name": materialName,
      "material_url": "",
      "matting": {
        "flag": 0,
        "has_use_quick_brush": false,
        "has_use_quick_eraser": false,
        "interactiveTime": [],
        "path": "",
        "strokes": []
      },
      "media_path": "",
      "object_locked": null,
      "origin_material_id": "",
      "path": path,
      "picture_from": "none",
      "picture_set_category_id": "",
      "picture_set_category_name": "",
      "request_id": "",
      "reverse_intensifies_path": "",
      "reverse_path": "",
      "smart_motion": null,
      "source": 1,
      "source_platform": 0,
      "stable": {
        "matrix_path": "",
        "stable_level": 0,
        "time_range": {
          "duration": 0,
          "start": 0
        }
      },
      "team_id": "",
      "type": "photo",
      "video_algorithm": {
        "algorithms": [],
        "deflicker": null,
        "motion_blur_config": null,
        "noise_reduction": null,
        "path": "",
        "quality_enhance": null,
        "time_range": null
      },
      "width": 2048
    };
  }


  public createVocalSeparation() {
    const id = this.genId();
    return {
      "choice": 0,
      "id": id,
      "production_path": "",
      "time_range": null,
      "type": "vocal_separation"
    };

  }


  public createTrack(options: {
    type: "video" | "text" | "audio",
    segments?: ISegment[]
  }) {
    const { type, segments = [] } = options;
    const id = this.genId();
    return {
      "attribute": 0,
      "flag": 0,
      "id": id,
      "is_default_name": true,
      "name": "",
      "segments": segments,
      "type": type
    };
  }

  public createTrackVideoSegment(options: {
    // 物料id
    materialId: string;
    duration: number;
    fromValue: number;
    toValue: number;
    keyframePropertyType: "KFTypePositionY" | "KFTypePositionX";
    targetTimeRangeStart: number;
    extraMaterialRefs: string[];
  }) {
    const {
      extraMaterialRefs = [],
      keyframePropertyType,
      materialId,
      duration,
      fromValue,
      toValue,
      targetTimeRangeStart
    } = options;
    return {
      "cartoon": false,
      "clip": {
        "alpha": 1.0,
        "flip": {
          "horizontal": false,
          "vertical": false
        },
        "rotation": 0.0,
        "scale": {
          "x": 1.35,
          "y": 1.35
        },
        "transform": {
          "x": 0.0,
          "y": 0.0
        }
      },
      "common_keyframes": [
        {
          "id": this.genId(),
          "keyframe_list": [
            {
              "curveType": "Line",
              "graphID": "",
              "id": this.genId(),
              "left_control": {
                "x": 0.0,
                "y": 0.0
              },
              "right_control": {
                "x": 0.0,
                "y": 0.0
              },
              "time_offset": 0,
              "values": [
                fromValue
              ]
            },
            {
              "curveType": "Line",
              "graphID": "",
              "id": this.genId(),
              "left_control": {
                "x": 0.0,
                "y": 0.0
              },
              "right_control": {
                "x": 0.0,
                "y": 0.0
              },
              "time_offset": duration,
              "values": [
                toValue
              ]
            }
          ],
          "material_id": "",
          "property_type": keyframePropertyType
        }
      ],
      "enable_adjust": true,
      "enable_color_curves": true,
      "enable_color_match_adjust": false,
      "enable_color_wheels": true,
      "enable_lut": true,
      "enable_smart_color_adjust": false,
      "extra_material_refs": extraMaterialRefs,
      "group_id": "",
      "hdr_settings": {
        "intensity": 1.0,
        "mode": 1,
        "nits": 1000
      },
      "id": this.genId(),
      "intensifies_audio": false,
      "is_placeholder": false,
      "is_tone_modify": false,
      "keyframe_refs": [],
      "last_nonzero_volume": 1.0,
      "material_id": materialId,
      "render_index": 0,
      "responsive_layout": {
        "enable": false,
        "horizontal_pos_layout": 0,
        "size_layout": 0,
        "target_follow": "",
        "vertical_pos_layout": 0
      },
      "reverse": false,
      "source_timerange": {
        "duration": duration,
        "start": 0
      },
      "speed": 1.0,
      "target_timerange": {
        "duration": duration,
        "start": targetTimeRangeStart
      },
      "template_id": "",
      "template_scene": "default",
      "track_attribute": 0,
      "track_render_index": 0,
      "uniform_scale": {
        "on": true,
        "value": 1.0
      },
      "visible": true,
      "volume": 1.0
    };
  }


  public createTrackTextSegment(options: {
    materialId: string;
    duration: number;
    start: number;
    extraMaterialRefs: string[];
  }) {
    const { materialId, duration, start, extraMaterialRefs = [] } = options;
    return {
      "cartoon": false,
      "clip": {
        "alpha": 1.0,
        "flip": {
          "horizontal": false,
          "vertical": false
        },
        "rotation": 0.0,
        "scale": {
          "x": 1.0,
          "y": 1.0
        },
        "transform": {
          "x": 0.0,
          "y": -0.8379629701375961
        }
      },
      "common_keyframes": [],
      "enable_adjust": false,
      "enable_color_curves": true,
      "enable_color_match_adjust": false,
      "enable_color_wheels": true,
      "enable_lut": false,
      "enable_smart_color_adjust": false,
      "extra_material_refs": extraMaterialRefs,
      "group_id": "",
      "hdr_settings": null,
      "id": this.genId(),
      "intensifies_audio": false,
      "is_placeholder": false,
      "is_tone_modify": false,
      "keyframe_refs": [],
      "last_nonzero_volume": 1.0,
      "material_id": materialId,
      "render_index": 14000,
      "responsive_layout": {
        "enable": false,
        "horizontal_pos_layout": 0,
        "size_layout": 0,
        "target_follow": "",
        "vertical_pos_layout": 0
      },
      "reverse": false,
      "source_timerange": null,
      "speed": 1.0,
      "target_timerange": {
        "duration": duration,
        "start": start
      },
      "template_id": "",
      "template_scene": "default",
      "track_attribute": 0,
      "track_render_index": 1,
      "uniform_scale": {
        "on": true,
        "value": 1.0
      },
      "visible": true,
      "volume": 1.0
    };
  }


  public createTrackAudioSegment(options: {
    materialId: string;
    duration: number;
    start: number;
    extraMaterialRefs: string[];
  }) {
    const { materialId, duration, start, extraMaterialRefs = [] } = options;
    return {
      "cartoon": false,
      "clip": null,
      "common_keyframes": [],
      "enable_adjust": false,
      "enable_color_curves": true,
      "enable_color_match_adjust": false,
      "enable_color_wheels": true,
      "enable_lut": false,
      "enable_smart_color_adjust": false,
      "extra_material_refs": extraMaterialRefs,
      "group_id": "",
      "hdr_settings": null,
      "id": this.genId(),
      "intensifies_audio": false,
      "is_placeholder": false,
      "is_tone_modify": false,
      "keyframe_refs": [],
      "last_nonzero_volume": 1.0,
      "material_id": materialId,
      "render_index": 0,
      "responsive_layout": {
        "enable": false,
        "horizontal_pos_layout": 0,
        "size_layout": 0,
        "target_follow": "",
        "vertical_pos_layout": 0
      },
      "reverse": false,
      "source_timerange": {
        "duration": duration,
        "start": 0
      },
      "speed": 1.0,
      "target_timerange": {
        "duration": duration,
        "start": start
      },
      "template_id": "",
      "template_scene": "default",
      "track_attribute": 0,
      "track_render_index": 0,
      "uniform_scale": null,
      "visible": true,
      "volume": 1.0
    };
  }


  public createSoundChannelMapping() {
    return {
      "audio_channel_mapping": 0,
      "id": this.genId(),
      "is_config_open": false,
      "type": "none"
    };
  }


  public createSpeed() {
    const id = this.genId();
    return {
      "curve_speed": null,
      "id": id,
      "mode": 0,
      "speed": 1.0,
      "type": "speed"
    };
  }


  public createMaterials() {
    return {
      audio_balances: [],
      audio_effects: [],
      audio_fades: [],
      audios: [],
      beats: [],
      canvases: [],
      chromas: [],
      color_curves: [],
      digital_humans: [],
      drafts: [],
      effects: [],
      flowers: [],
      green_screens: [],
      handwrites: [],
      hsl: [],
      images: [],
      log_color_wheels: [],
      loudnesses: [],
      manual_deformations: [],
      masks: [],
      material_animations: [],
      material_colors: [],
      placeholders: [],
      plugin_effects: [],
      primary_color_wheels: [],
      realtime_denoises: [],
      shapes: [],
      smart_crops: [],
      smart_relights: [],
      sound_channel_mappings: [],
      speeds: [],
      stickers: [],
      tail_leaders: [],
      text_templates: [],
      texts: [],
      transitions: [],
      video_effects: [],
      video_trackings: [],
      videos: [],
      vocal_beautifys: [],
      vocal_separations: [],
    };
  }
}
