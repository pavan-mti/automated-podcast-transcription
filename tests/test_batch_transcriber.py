import unittest
from unittest.mock import patch, MagicMock
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# --- MOCK HEAVY DEPENDENCIES BEFORE IMPORT ---
mock_whisper_module = MagicMock()
sys.modules['src.transcription.whisper_transcriber'] = mock_whisper_module

# Now import
from src.transcription.batch_transcriber import transcribe_single_audio, transcribe_all_audios

class TestBatchTranscriber(unittest.TestCase):

    def setUp(self):
        from src.transcription.whisper_transcriber import transcribe_audio
        transcribe_audio.reset_mock()

    @patch('src.transcription.batch_transcriber.os.path.exists')
    def test_transcribe_single_audio(self, mock_exists):
        mock_exists.return_value = True
        
        # Define side effect to match expected output behavior
        from src.transcription.whisper_transcriber import transcribe_audio
        def print_success(audio, output):
            print(f"Saved transcript to {output}")
        transcribe_audio.side_effect = print_success

        audio_path = os.path.join("data", "processed", "test.wav")
        transcribe_single_audio(audio_path)
        
        mock_exists.assert_called_with(audio_path)
        
        transcribe_audio.assert_called_once()
        args, _ = transcribe_audio.call_args
        
        self.assertIn("test.wav", args[0])
        self.assertIn("test.json", args[1])

    @patch('src.transcription.batch_transcriber.os.listdir')
    def test_transcribe_all_audios(self, mock_listdir):
        mock_listdir.return_value = ["a.wav", "b.mp3"]
        mock_exists_patcher = patch(
            'src.transcription.batch_transcriber.os.path.exists',
            return_value=True
        )
        mock_exists_patcher.start()
        
        from src.transcription.whisper_transcriber import transcribe_audio
        # Ensure side effect is applied here too (reset_mock clears it?) 
        # reset_mock does NOT clear side_effect usually, but let's be safe or just rely on setUp if we moved it there. 
        # Actually setUp resets the mock object entirely? No, reset_mock() keeps configuration but clears history.
        # But wait, in setUp I call transcribe_audio.reset_mock().
        # I need to set side_effect EITHER in setUp OR in each test. 
        # Let's set it here for clarity.
        def print_success(audio, output):
            print(f"Saved transcript to {output}")
        transcribe_audio.side_effect = print_success
        
        transcribe_all_audios()
        
        self.assertEqual(transcribe_audio.call_count, 2)
        calls = transcribe_audio.call_args_list
        
        self.assertIn("a.wav", calls[0][0][0])
        self.assertIn("a.json", calls[0][0][1])
        
        self.assertIn("b.mp3", calls[1][0][0])
        self.assertIn("b.json", calls[1][0][1])

        mock_exists_patcher.stop()

if __name__ == '__main__':
    unittest.main()
