import SwiftUI
import WebKit

struct ContentView: View {
    var body: some View {
        WebView(url: URL(string: "https://one-three-one.vercel.app")!)
            .ignoresSafeArea()
    }
}

struct WebView: UIViewRepresentable {
    let url: URL

    func makeCoordinator() -> Coordinator {
        Coordinator()
    }

    func makeUIView(context: Context) -> WKWebView {
        let config = WKWebViewConfiguration()
        config.allowsInlineMediaPlayback = true
        config.preferences.javaScriptCanOpenWindowsAutomatically = true

        let webView = WKWebView(frame: .zero, configuration: config)
        webView.navigationDelegate = context.coordinator
        webView.scrollView.bounces = false
        webView.scrollView.keyboardDismissMode = .interactive
        webView.scrollView.contentInsetAdjustmentBehavior = .never

        // Dark background to match app while loading
        webView.backgroundColor = UIColor(red: 0.04, green: 0.04, blue: 0.06, alpha: 1)
        webView.scrollView.backgroundColor = UIColor(red: 0.04, green: 0.04, blue: 0.06, alpha: 1)
        webView.isOpaque = false

        let request = URLRequest(url: url, cachePolicy: .reloadIgnoringLocalCacheData)
        webView.load(request)
        return webView
    }

    func updateUIView(_ webView: WKWebView, context: Context) {}

    class Coordinator: NSObject, WKNavigationDelegate {
        func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
            // Fix iOS text editing in WKWebView — enables proper keyboard + delete key
            let js = """
                document.addEventListener('touchstart', function(e) {
                    var target = e.target;
                    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
                        target.focus();
                    }
                }, true);
            """
            webView.evaluateJavaScript(js, completionHandler: nil)
        }

        func webView(_ webView: WKWebView,
                     decidePolicyFor navigationAction: WKNavigationAction,
                     decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
            decisionHandler(.allow)
        }
    }
}
