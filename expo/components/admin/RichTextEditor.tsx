import React, { useRef } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { SoulworxColors, Spacing, BorderRadius } from '@/constants/colors';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  style?: any;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Enter text...',
  style,
}) => {
  const webViewRef = useRef<WebView>(null);

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            font-size: 16px;
            line-height: 1.5;
            color: #333;
            padding: ${Spacing.md}px;
            min-height: 200px;
          }
          #editor {
            min-height: 200px;
            outline: none;
            word-wrap: break-word;
          }
          #editor:empty:before {
            content: "${placeholder}";
            color: #999;
          }
        </style>
      </head>
      <body>
        <div id="editor" contenteditable="true">${value || ''}</div>
        <script>
          function updateContent() {
            const content = document.getElementById('editor').innerHTML;
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'content', html: content }));
          }
          
          document.getElementById('editor').addEventListener('input', updateContent);
          document.getElementById('editor').addEventListener('blur', updateContent);
        </script>
      </body>
    </html>
  `;

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'content') {
        onChange(data.html);
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  };

  return (
    <View style={[styles.container, style]}>
      <WebView
        ref={webViewRef}
        source={{ html: htmlContent }}
        onMessage={handleMessage}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={Platform.OS === 'android'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: SoulworxColors.white,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: SoulworxColors.border,
    overflow: 'hidden',
    minHeight: 250,
  },
  webview: {
    backgroundColor: 'transparent',
  },
});

export default RichTextEditor;


