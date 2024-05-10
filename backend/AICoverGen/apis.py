import os
import torch
import argparse
import json
from AICoverGen.src.main import song_cover_pipeline, preprocess_song, run_mdx, convert_to_stereo, rvc_models_dir, mdxnet_models_dir

class deafult_args():
    def __init__(self):
        self.keep_files = True
        self.index_rate = 0.5
        self.filter_radius = 3
        self.rms_mix_rate = 0.25
        self.crepe_hop_length = 128
        self.pitch_detection_algo = 'rmvpe'
        self.protect = 0.33
        self.main_vol = 0
        self.backup_vol = 0
        self.inst_vol = 0
        self.pitch_change_all = 0
        self.reverb_size = 0.15
        self.reverb_wetness = 0.2
        self.reverb_dryness = 0.8
        self.reverb_damping = 0.7
        self.output_format = 'mp3'


def generate_song(song_input, rvc_dirname, output_path, pitch_change):
    parser = argparse.ArgumentParser(description='Generate a AI cover song in the song_output/id directory.', add_help=True)
    #parser.add_argument('-i', '--song-input', type=str, required=True, help='Link to a YouTube video or the filepath to a local mp3/wav file to create an AI cover of')
    #parser.add_argument('-dir', '--rvc-dirname', type=str, required=True, help='Name of the folder in the rvc_models directory containing the RVC model file and optional index file to use')
    #parser.add_argument('-out', '--output_path', type=str, required=True, help='path to the output file name')
    #parser.add_argument('-p', '--pitch-change', type=int, required=True, help='Change the pitch of AI Vocals only. Generally, use 1 for male to female and -1 for vice-versa. (Octaves)')
    parser.add_argument('-k', '--keep-files', action=argparse.BooleanOptionalAction, help='Whether to keep all intermediate audio files generated in the song_output/id directory, e.g. Isolated Vocals/Instrumentals')
    parser.add_argument('-ir', '--index-rate', type=float, default=0.5, help='A decimal number e.g. 0.5, used to reduce/resolve the timbre leakage problem. If set to 1, more biased towards the timbre quality of the training dataset')
    parser.add_argument('-fr', '--filter-radius', type=int, default=3, help='A number between 0 and 7. If >=3: apply median filtering to the harvested pitch results. The value represents the filter radius and can reduce breathiness.')
    parser.add_argument('-rms', '--rms-mix-rate', type=float, default=0.25, help="A decimal number e.g. 0.25. Control how much to use the original vocal's loudness (0) or a fixed loudness (1).")
    parser.add_argument('-palgo', '--pitch-detection-algo', type=str, default='rmvpe', help='Best option is rmvpe (clarity in vocals), then mangio-crepe (smoother vocals).')
    parser.add_argument('-hop', '--crepe-hop-length', type=int, default=128, help='If pitch detection algo is mangio-crepe, controls how often it checks for pitch changes in milliseconds. The higher the value, the faster the conversion and less risk of voice cracks, but there is less pitch accuracy. Recommended: 128.')
    parser.add_argument('-pro', '--protect', type=float, default=0.33, help='A decimal number e.g. 0.33. Protect voiceless consonants and breath sounds to prevent artifacts such as tearing in electronic music. Set to 0.5 to disable. Decrease the value to increase protection, but it may reduce indexing accuracy.')
    parser.add_argument('-mv', '--main-vol', type=int, default=0, help='Volume change for AI main vocals in decibels. Use -3 to decrease by 3 decibels and 3 to increase by 3 decibels')
    parser.add_argument('-bv', '--backup-vol', type=int, default=0, help='Volume change for backup vocals in decibels')
    parser.add_argument('-iv', '--inst-vol', type=int, default=0, help='Volume change for instrumentals in decibels')
    parser.add_argument('-pall', '--pitch-change-all', type=int, default=0, help='Change the pitch/key of vocals and instrumentals. Changing this slightly reduces sound quality')
    parser.add_argument('-rsize', '--reverb-size', type=float, default=0.15, help='Reverb room size between 0 and 1')
    parser.add_argument('-rwet', '--reverb-wetness', type=float, default=0.2, help='Reverb wet level between 0 and 1')
    parser.add_argument('-rdry', '--reverb-dryness', type=float, default=0.8, help='Reverb dry level between 0 and 1')
    parser.add_argument('-rdamp', '--reverb-damping', type=float, default=0.7, help='Reverb damping between 0 and 1')
    parser.add_argument('-oformat', '--output-format', type=str, default='mp3', help='Output format of audio file. mp3 for smaller file size, wav for best quality')
    #args = parser.parse_args()

    args = deafult_args()

    if not os.path.exists(os.path.join(rvc_models_dir, rvc_dirname)):
        raise Exception(f'The folder {os.path.join(rvc_models_dir, rvc_dirname)} does not exist.')

    cover_path = song_cover_pipeline(song_input, rvc_dirname, output_path, pitch_change, args.keep_files,
                                     main_gain=args.main_vol, backup_gain=args.backup_vol, inst_gain=args.inst_vol,
                                     index_rate=args.index_rate, filter_radius=args.filter_radius,
                                     rms_mix_rate=args.rms_mix_rate, f0_method=args.pitch_detection_algo,
                                     crepe_hop_length=args.crepe_hop_length, protect=args.protect,
                                     pitch_change_all=args.pitch_change_all,
                                     reverb_rm_size=args.reverb_size, reverb_wet=args.reverb_wetness,
                                     reverb_dry=args.reverb_dryness, reverb_damping=args.reverb_damping,
                                     output_format=args.output_format)
    
    return cover_path



def preprocess(song_input, output_dir, song_id):
    orig_song_path = song_input
    keep_orig = True
    song_output_dir = os.path.join(output_dir, song_id)
    os.makedirs(song_output_dir, exist_ok=True)
    orig_song_path = convert_to_stereo(orig_song_path)

    with open(os.path.join(mdxnet_models_dir, 'model_data.json')) as infile:
        mdx_model_params = json.load(infile)

    with torch.no_grad():
        vocals_path, instrumentals_path = run_mdx(mdx_model_params, song_output_dir, os.path.join(mdxnet_models_dir, 'UVR-MDX-NET-Voc_FT.onnx'), orig_song_path, denoise=True, keep_orig=keep_orig, device='cpu')

        backup_vocals_path, main_vocals_path = run_mdx(mdx_model_params, song_output_dir, os.path.join(mdxnet_models_dir, 'UVR_MDXNET_KARA_2.onnx'), vocals_path, suffix='Backup', invert_suffix='Main', denoise=True, device='cpu')

        _, main_vocals_dereverb_path = run_mdx(mdx_model_params, song_output_dir, os.path.join(mdxnet_models_dir, 'Reverb_HQ_By_FoxJoy.onnx'), main_vocals_path, invert_suffix='DeReverb', exclude_main=True, denoise=True, device='cpu')

    return orig_song_path, vocals_path, instrumentals_path, main_vocals_path, backup_vocals_path, main_vocals_dereverb_path