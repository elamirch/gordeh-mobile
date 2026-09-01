package com.gordeh.app;

import android.content.Intent;
import android.net.ConnectivityManager;
import android.net.Network;
import android.net.NetworkCapabilities;
import android.net.Uri;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;
import java.util.Arrays;
import java.util.List;

public class MainActivity extends BridgeActivity {

    private static final List<String> DEEP_LINK_HOSTS = Arrays.asList("gordeh.com", "www.gordeh.com");

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        handleDeepLink(intent);
    }

    private void handleDeepLink(Intent intent) {
        if (intent == null || !Intent.ACTION_VIEW.equals(intent.getAction())) {
            return;
        }
        Uri data = intent.getData();
        if (data == null || !isDeepLink(data) || bridge == null || bridge.getWebView() == null) {
            return;
        }
        if (!isOnline()) {
            return;
        }
        final String url = data.toString();
        final WebView webView = bridge.getWebView();
        webView.post(new Runnable() {
            @Override
            public void run() {
                webView.loadUrl(url);
            }
        });
    }

    private boolean isDeepLink(Uri data) {
        String scheme = data.getScheme();
        if (scheme == null || !(scheme.equalsIgnoreCase("https") || scheme.equalsIgnoreCase("http"))) {
            return false;
        }
        String host = data.getHost();
        return host != null && DEEP_LINK_HOSTS.contains(host.toLowerCase());
    }

    private boolean isOnline() {
        ConnectivityManager cm = (ConnectivityManager) getSystemService(CONNECTIVITY_SERVICE);
        if (cm == null) {
            return false;
        }
        Network network = cm.getActiveNetwork();
        if (network == null) {
            return false;
        }
        NetworkCapabilities caps = cm.getNetworkCapabilities(network);
        return caps != null && caps.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET);
    }
}
